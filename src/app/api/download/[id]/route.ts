import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Sign in" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const gen = await prisma.generation.findUnique({ where: { id: params.id } });
  if (!gen || gen.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!gen.zipPath || !fs.existsSync(gen.zipPath)) {
    return NextResponse.json({ error: "ZIP not ready" }, { status: 404 });
  }
  const buf = fs.readFileSync(gen.zipPath);
  const safeName = (gen.title || "printable")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeName || "printable"}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
