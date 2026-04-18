"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HeaderNav() {
  const { data: session } = useSession();
  const signedIn = !!session?.user;
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
    </nav>
  );
}
