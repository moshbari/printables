"use client";
import { useState } from "react";

export default function AdminGrantForm() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [tier, setTier] = useState<"PRO" | "FREE">("PRO");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  async function submit() {
    setMsg("");
    setErr("");
    if (!email.trim()) {
      setErr("Paste an email first.");
      return;
    }
    if (!token.trim()) {
      setErr("Paste your admin token.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/admin/grant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ email, tier }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setMsg(
        tier === "PRO"
          ? `✅ Done. ${j.email} now has full access.`
          : `✅ Done. ${j.email} is back on Free.`,
      );
      setEmail("");
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-bold uppercase tracking-wider text-mute">
          Admin token
        </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="paste your admin token"
          className="mt-2 w-full px-5 py-4 rounded-2xl border border-black/10 focus:border-accent outline-none"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-bold uppercase tracking-wider text-mute">
          Buyer's email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="buyer@example.com"
          className="mt-2 w-full px-5 py-4 rounded-2xl border border-black/10 focus:border-accent outline-none text-lg"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-bold uppercase tracking-wider text-mute">
          Plan
        </label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTier("PRO")}
            disabled={loading}
            className={`p-4 rounded-2xl border-2 font-bold ${
              tier === "PRO"
                ? "border-accent bg-accent/5"
                : "border-black/10 bg-white hover:border-black/30"
            }`}
          >
            PRO (full access)
          </button>
          <button
            type="button"
            onClick={() => setTier("FREE")}
            disabled={loading}
            className={`p-4 rounded-2xl border-2 font-bold ${
              tier === "FREE"
                ? "border-accent bg-accent/5"
                : "border-black/10 bg-white hover:border-black/30"
            }`}
          >
            Free (remove access)
          </button>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="btn-primary-xl w-full disabled:opacity-60"
      >
        {loading ? "Working…" : tier === "PRO" ? "Grant full access" : "Remove access"}
      </button>

      {msg ? <div className="text-green-700 text-sm">{msg}</div> : null}
      {err ? <div className="text-red-600 text-sm">{err}</div> : null}
    </div>
  );
}
