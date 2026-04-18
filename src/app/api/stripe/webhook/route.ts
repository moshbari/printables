import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e: any) {
    console.error("[stripe] bad signature", e?.message);
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId = s.metadata?.userId;
        const subscriptionId = s.subscription as string | null;
        const customerId = s.customer as string | null;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              tier: "PRO",
              subscriptionId: subscriptionId || undefined,
              stripeCustomerId: customerId || undefined,
            },
          });
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = (sub.metadata?.userId as string) || null;
        if (userId) {
          const active = ["active", "trialing"].includes(sub.status);
          await prisma.user.update({
            where: { id: userId },
            data: {
              tier: active ? "PRO" : "FREE",
              subscriptionId: sub.id,
              subEndsAt: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = (sub.metadata?.userId as string) || null;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { tier: "FREE", subEndsAt: new Date() },
          });
        }
        break;
      }
    }
  } catch (e) {
    console.error("[stripe] webhook handler error", e);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
