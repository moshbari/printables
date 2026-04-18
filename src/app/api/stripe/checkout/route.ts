import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Sign in" }, { status: 401 });
  const userId = (session.user as any).id as string;
  const email = session.user.email!;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "No user" }, { status: 404 });
  if (!STRIPE_PRICE_ID) {
    return NextResponse.json({ error: "STRIPE_PRICE_ID not set" }, { status: 500 });
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const c = await stripe.customers.create({ email, metadata: { userId } });
    customerId = c.id;
    await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
  }

  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const cs = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${base}/thanks`,
    cancel_url: `${base}/pricing`,
    metadata: { userId },
    subscription_data: { metadata: { userId } },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: cs.url });
}
