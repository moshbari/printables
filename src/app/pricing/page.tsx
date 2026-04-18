import Link from "next/link";
import { getSession } from "@/lib/auth";
import UpgradeBtn from "./UpgradeBtn";

export default async function Pricing() {
  const session = await getSession();
  const tier = (session?.user as any)?.tier || "FREE";

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-black">Simple pricing.</h1>
        <p className="mt-3 text-lg text-mute">One free to try. $27/mo for unlimited. Cancel anytime.</p>
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="card p-8">
          <div className="text-sm font-bold uppercase text-mute">Free</div>
          <div className="mt-2 text-5xl font-black">$0</div>
          <p className="mt-2 text-mute">See the magic. Make 1 printable. On us.</p>
          <ul className="mt-6 space-y-2 text-mute">
            <li>✅ 1 full printable</li>
            <li>✅ PDF, cover, title, tags, pins</li>
            <li>✅ Ready to upload to Etsy</li>
          </ul>
          <div className="mt-8">
            <Link href={session?.user ? "/generate" : "/signin"} className="btn-ghost w-full">Start free</Link>
          </div>
        </div>

        <div className="card p-8 border-2 border-accent shadow-glow bg-gradient-to-br from-white to-paper">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold uppercase text-accent">PRO — most popular</div>
            <span className="text-xs bg-accent text-white px-2 py-1 rounded-full">⚡ Unlimited</span>
          </div>
          <div className="mt-2 text-5xl font-black">
            $27<span className="text-xl text-mute font-normal">/mo</span>
          </div>
          <p className="mt-2 text-mute">Build a real printables shop. One click per printable.</p>
          <ul className="mt-6 space-y-2 text-mute">
            <li>✅ Unlimited printables (fair use 200/mo)</li>
            <li>✅ Pinterest pins included</li>
            <li>✅ Day 1 launch plan included</li>
            <li>✅ Cancel in one click</li>
          </ul>
          <div className="mt-8">
            {tier === "PRO" ? (
              <div className="btn-ghost w-full">You're on PRO 🎉</div>
            ) : session?.user ? (
              <UpgradeBtn />
            ) : (
              <Link href="/signin" className="btn-primary w-full">Sign in to upgrade</Link>
            )}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-mute">
        Taxes may apply. Payment is secured by Stripe. No hidden fees.
      </p>
    </div>
  );
}
