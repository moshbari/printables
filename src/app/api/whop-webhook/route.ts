import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/whop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Whop webhook receiver.
// Flips users to PRO when a membership goes valid, back to FREE when it
// goes invalid/cancelled. Matches by metadata.userId first, then email.
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get("x-whop-signature");

  if (!verifyWebhookSignature(raw, sig)) {
    console.error("[whop-webhook] bad signature");
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const type = String(event?.action || event?.type || "").toLowerCase();
  const data = event?.data || {};
  console.log("[whop-webhook]", type, data?.id || "");

  try {
    // Valid/active membership → PRO
    if (
      type.includes("membership.went_valid") ||
      type === "membership_activated" ||
      type === "membership.created"
    ) {
      await upgradeUser(data);
    }
    // Invalid/cancelled/expired → FREE
    else if (
      type.includes("membership.went_invalid") ||
      type === "membership_deactivated" ||
      type === "membership.cancelled" ||
      type === "membership.expired"
    ) {
      await downgradeUser(data);
    }
    // Invoice paid — also treat as activation insurance
    else if (type === "invoice_paid" || type.includes("payment.succeeded")) {
      await upgradeUser(data);
    }
  } catch (e) {
    console.error("[whop-webhook] handler error", e);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function findUser(data: any) {
  // Preferred: our userId was stamped into checkout metadata
  const metaUserId: string | undefined =
    data?.metadata?.userId || data?.checkout_session?.metadata?.userId;
  if (metaUserId) {
    const u = await prisma.user.findUnique({ where: { id: metaUserId } });
    if (u) return u;
  }
  // Fallback: match by email
  const email: string | undefined =
    data?.user?.email || data?.email || data?.user_email || data?.buyer?.email;
  if (email) {
    const u = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (u) return u;
  }
  return null;
}

async function upgradeUser(data: any) {
  const user = await findUser(data);
  if (!user) {
    console.warn("[whop-webhook] upgrade: no matching user", data?.id);
    return;
  }
  const membershipId: string | undefined = data?.id || data?.membership?.id;
  const ends = data?.renewal_period_end || data?.expires_at || data?.ends_at;
  await prisma.user.update({
    where: { id: user.id },
    data: {
      tier: "PRO",
      subscriptionId: membershipId || user.subscriptionId || undefined,
      subEndsAt: ends ? new Date(Number(ends) * (String(ends).length > 10 ? 1 : 1000)) : null,
    },
  });
  console.log("[whop-webhook] upgraded user", user.id);
}

async function downgradeUser(data: any) {
  const user = await findUser(data);
  if (!user) {
    console.warn("[whop-webhook] downgrade: no matching user", data?.id);
    return;
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { tier: "FREE", subEndsAt: new Date() },
  });
  console.log("[whop-webhook] downgraded user", user.id);
}
