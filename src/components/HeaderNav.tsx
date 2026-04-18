"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function HeaderNav() {
  const { data: session } = useSession();
  const signedIn = !!session?.user;
  const email = session?.user?.email || "";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <nav className="flex items-center gap-2">
      <Link href="/pricing" className="btn-ghost hidden sm:inline-flex">Pricing</Link>
      {signedIn ? (
        <Link href="/dashboard" className="btn-ghost">My Printables</Link>
      ) : null}
      {signedIn ? (
        <Link href="/generate" className="btn-primary !px-5 !py-3 !text-base">Make one</Link>
      ) : (
        <Link href="/signin" className="btn-primary !px-5 !py-3 !text-base">Start free</Link>
      )}
      {signedIn ? (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 rounded-full bg-ink text-paper flex items-center justify-center font-black text-lg hover:opacity-90"
            aria-label="Account menu"
            title={email}
          >
            {(email[0] || "U").toUpperCase()}
          </button>
          {open ? (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-paper border border-black/10 shadow-xl p-3 z-50">
              <div className="px-3 py-2">
                <div className="text-xs text-mute font-bold uppercase">Signed in as</div>
                <div className="text-sm font-bold break-all mt-1">{email}</div>
              </div>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block px-3 py-3 rounded-xl hover:bg-black/5 text-sm font-bold"
              >
                My Printables
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left block px-3 py-3 rounded-xl hover:bg-black/5 text-sm font-bold text-red-600"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </nav>
  );
}
