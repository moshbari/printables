import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Manual access grant.
 * Use this after a buyer pays on WHOP / JVZoo / WarriorPlus.
 * Flips a user's tier to PRO (or back to FREE) by email.
 *
 * Auth: pass header `x-admin-token: <ADMIN_TOKEN>`
 *       OR query ?token=<ADMIN_TOKEN>
 *
 * Body (JSON):
 *   { "email": "buyer@example.com", "tier": "PRO" | "FREE" }
 *
 * If the user does not exist yet, one is created so that when they
 * sign in with magic link later, they're already PRO.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.ADMIN_TOKEN || "";
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_TOKEN not set on server" }, { status: 500 });
  }

  const headerToken = req.headers.get("x-admin-token") || "";
  const urlToken = new URL(req.url).searchParams.get("token") || "";
  if (headerToken !== expected && urlToken !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").trim().toLowerCase();
  const tier = body?.tier === "FREE" ? "FREE" : "PRO";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const updated = await prisma.user.update({
      where: { email },
      data: { tier, freeUsed: false },
    });
    return NextResponse.json({
      ok: true,
      action: "updated",
      email: updated.email,
      tier: updated.tier,
    });
  }

  const created = await prisma.user.create({
    data: { email, tier },
  });
  return NextResponse.json({
    ok: true,
    action: "created",
    email: created.email,
    tier: created.tier,
  });
}
