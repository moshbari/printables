"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const params = useSearchParams();
  const check = params.get("check");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await signIn("email", { email, redirect: false, callbackUrl: "/generate" });
    setSent(true);
    setLoading(false);
  }

  const showSent = sent || check === "1";

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <div className="card p-10 text-center">
        <h1 className="text-3xl font-black">Sign in</h1>
        <p className="mt-2 text-mute">We'll email you a magic link. One click, you're in.</p>

        {showSent ? (
          <div className="mt-8 p-6 rounded-2xl bg-paper border border-black/5">
            <div className="text-5xl">📬</div>
            <h2 className="mt-3 text-xl font-bold">Check your email</h2>
            <p className="mt-2 text-mute">Open it and click the big button.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-5 py-4 rounded-2xl border border-black/10 focus:border-accent outline-none text-lg"
            />
            <button type="submit" disabled={loading} className="btn-primary-xl w-full disabled:opacity-60">
              {loading ? "Sending…" : "Send me the link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
