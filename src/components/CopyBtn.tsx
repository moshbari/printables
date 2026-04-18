"use client";
import { useState } from "react";

export default function CopyBtn({
  value,
  label = "Copy",
  full = false,
}: {
  value: string;
  label?: string;
  full?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      type="button"
      onClick={copy}
      className={`btn-dark ${full ? "w-full" : ""} !px-5 !py-3 !text-base`}
    >
      {copied ? "✓ Copied!" : label}
    </button>
  );
}
