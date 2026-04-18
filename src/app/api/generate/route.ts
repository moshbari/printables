import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateListing, generateCover } from "@/lib/openai";
import { renderListingPdf } from "@/lib/pdf";
import { buildZip } from "@/lib/zip";
import { STORAGE_DIR, ensureStorage, writeFileSafe } from "@/lib/storage";

export const maxDuration = 120;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FAIR_USE_MONTHLY = 200;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Sign in first" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const { idea, template } = await req.json().catch(() => ({}));
  if (!idea || typeof idea !== "string") {
    return NextResponse.json({ error: "Please type an idea" }, { status: 400 });
  }

  // Fetch fresh user state (tier/freeUsed)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Paywall: free tier, already used their 1 free
  if (user.tier === "FREE" && user.freeUsed) {
    return NextResponse.json({ error: "paywall" }, { status: 402 });
  }

  // Fair-use cap for PRO
  if (user.tier === "PRO") {
    const since = new Date();
    since.setDate(since.getDate() - 30);
    const usage = await prisma.generation.count({
      where: { userId, createdAt: { gte: since } },
    });
    if (usage >= FAIR_USE_MONTHLY) {
      return NextResponse.json(
        { error: `Fair-use cap hit (${FAIR_USE_MONTHLY}/mo). Try again tomorrow.` },
        { status: 429 },
      );
    }
  }

  ensureStorage();

  // Create DB row first so we can use its id for storage
  const gen = await prisma.generation.create({
    data: {
      userId,
      idea: idea.slice(0, 280),
      template: String(template || "journal"),
      status: "pending",
    },
  });

  try {
    // 1. Text generation
    const listing = await generateListing(idea, String(template || "journal"));

    // 2. Cover image (non-blocking-style: if fails we render text-only cover)
    const coverB64 = await generateCover(listing.cover_prompt || listing.title).catch(() => "");

    // 3. PDF
    const pdf = await renderListingPdf({
      title: listing.title,
      pages: listing.pages || [],
      coverBase64: coverB64 || undefined,
    });

    // 4. Listing text file
    const listingText = [
      `TITLE`,
      listing.title,
      ``,
      `DESCRIPTION`,
      listing.description,
      ``,
      `PRICE`,
      `$${Number(listing.price).toFixed(2)}`,
      ``,
      `TAGS (paste into Etsy — 13 tags)`,
      listing.tags.join(", "),
      ``,
      `PINTEREST PINS`,
      ...listing.pins.map((p, i) => `${i + 1}. ${p.pin_title}\n   ${p.pin_description}`),
      ``,
      `DAY 1 LAUNCH PLAN`,
      ...listing.day_one_plan.map((s, i) => `${i + 1}. ${s}`),
    ].join("\n");

    // 5. Save PDF + cover to disk
    const dir = path.join(STORAGE_DIR, gen.id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const pdfPath = path.join(dir, "printable.pdf");
    writeFileSafe(pdfPath, pdf);
    let coverPath: string | null = null;
    if (coverB64) {
      coverPath = path.join(dir, "cover.png");
      writeFileSafe(coverPath, Buffer.from(coverB64, "base64"));
    }

    // 6. Build ZIP
    const entries: { name: string; content: Buffer | string }[] = [
      { name: "printable.pdf", content: pdf },
      { name: "etsy-listing.txt", content: listingText },
    ];
    if (coverB64) entries.push({ name: "cover.png", content: Buffer.from(coverB64, "base64") });
    const zipBuf = await buildZip(entries);
    const zipPath = path.join(dir, "printable.zip");
    writeFileSafe(zipPath, zipBuf);

    // 7. Update DB
    await prisma.generation.update({
      where: { id: gen.id },
      data: {
        status: "ready",
        title: listing.title,
        description: listing.description,
        tags: listing.tags,
        price: Number(listing.price) || null,
        pdfPath,
        zipPath,
        coverPath,
      },
    });

    // 8. Mark free used if applicable
    if (user.tier === "FREE" && !user.freeUsed) {
      await prisma.user.update({ where: { id: userId }, data: { freeUsed: true } });
    }

    return NextResponse.json({
      id: gen.id,
      title: listing.title,
      description: listing.description,
      tags: listing.tags,
      price: Number(listing.price) || 0,
      pages: listing.pages,
      pins: listing.pins,
      day_one_plan: listing.day_one_plan,
      coverUrl: coverB64 ? `/api/file/${gen.id}/cover.png` : undefined,
      zipUrl: `/api/download/${gen.id}`,
      pdfUrl: `/api/file/${gen.id}/printable.pdf`,
    });
  } catch (e: any) {
    console.error("[generate] failed", e);
    await prisma.generation.update({
      where: { id: gen.id },
      data: { status: "failed" },
    }).catch(() => {});
    return NextResponse.json({ error: e?.message || "Generation failed" }, { status: 500 });
  }
}
