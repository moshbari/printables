import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { buildCheckoutUrl } from "@/lib/whop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Click "Get full access" → we stamp the user's ID onto the checkout URL
// so the Whop webhook can upgrade the right account when payment succeeds.
export async function POST() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  }
  const userId = (session.user as any).id as string;
  const email = session.user.email || undefined;

  const url = buildCheckoutUrl({ userId, email });
  return NextResponse.json({ url });
}
