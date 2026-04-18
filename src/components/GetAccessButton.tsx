"use client";

import { useState } from "react";

export default function GetAccessButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/whop/checkout", { method: "POST" });
      const j = await res.json();
      if (j?.url) {
        window.location.href = j.url;
      } else {
        alert(j?.error || "Could not start checkout.");
        setLoading(false);
      }
    } catch (e) {
      alert("Could not start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick} disabled={loading} className="btn-primary-xl w-full">
      {loading ? "Opening checkout…" : "Get full access"}
    </button>
  );
}
