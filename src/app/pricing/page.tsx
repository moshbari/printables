import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Pricing() {
  const session = await getSession();
  const tier = (session?.user as any)?.tier || "FREE";
  const email = session?.user?.email || "";

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-black">Simple pricing.</h1>
        <p className="mt-3 text-lg text-mute">One free to try. Ask for full access when you want unlimited.</p>
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
            Full access
          </div>
          <p className="mt-2 text-mute">Build a real printables shop. One click per printable.</p>
          <ul className="mt-6 space-y-2 text-mute">
            <li>✅ Unlimited printables (fair use 200/mo)</li>
            <li>✅ Pinterest pins included</li>
            <li>✅ Day 1 launch plan included</li>
            <li>✅ One-click access</li>
          </ul>
          <div className="mt-8">
            {tier === "PRO" ? (
              <div className="btn-ghost w-full">You're on PRO 🎉</div>
            ) : session?.user ? (
              <a
                href={`mailto:hello@99dfy.com?subject=Printables%20access%20request&body=Please%20give%20me%20full%20access.%20My%20email%3A%20${encodeURIComponent(email)}`}
                className="btn-primary-xl w-full text-center block"
              >
                Request full access
              </a>
            ) : (
              <Link href="/signin" className="btn-primary w-full">Sign in to request access</Link>
            )}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-mute">
        Checkout opens soon. For now, just ask and we'll flip the switch.
      </p>
    </div>
  );
}
