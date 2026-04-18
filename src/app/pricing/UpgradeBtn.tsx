"use client";
import { useState } from "react";

export default function UpgradeBtn() {
  const [loading, setLoading] = useState(false);
  async function go() {
    setLoading(true);
    const r = await fetch("/api/stripe/checkout", { method: "POST" });
    const j = await r.json();
    if (j.url) window.location.href = j.url;
    else setLoading(false);
  }
  return (
    <button onClick={go} disabled={loading} className="btn-primary-xl w-full disabled:opacity-60">
      {loading ? "Opening checkout…" : "Upgrade to PRO — $27/mo"}
    </button>
  );
}
