import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STORAGE_DIR } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["cover.png", "printable.pdf"]);

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string; name: string } },
) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Sign in" }, { status: 401 });
  const userId = (session.user as any).id as string;

  if (!ALLOWED.has(params.name)) return NextResponse.json({ error: "Bad file" }, { status: 400 });

  const gen = await prisma.generation.findUnique({ where: { id: params.id } });
  if (!gen || gen.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Prefer the stored pointer (GHL URL or disk path) over a reconstructed disk path.
  // Legacy rows from before GHL migration still have plain disk paths; those keep working.
  const stored = params.name.endsWith(".pdf") ? gen.pdfPath : gen.coverPath;

  if (stored && (stored.startsWith("http://") || stored.startsWith("https://"))) {
    return NextResponse.redirect(stored, 302);
  }

  const filePath = stored && stored.startsWith("/")
    ? stored
    : path.join(STORAGE_DIR, params.id, params.name);
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: "Missing" }, { status: 404 });
  const buf = fs.readFileSync(filePath);
  const type = params.name.endsWith(".pdf") ? "application/pdf" : "image/png";
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": type,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
