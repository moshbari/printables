import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import Providers from "@/components/Providers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Printables — Etsy-ready printables in 60 seconds",
  description:
    "Type your idea. Click Generate. Download a ready-to-sell Etsy printable with title, tags, cover, and Pinterest pins.",
  openGraph: {
    title: "Printables — Etsy-ready printables in 60 seconds",
    description:
      "Type your idea. Click Generate. Download a ready-to-sell Etsy printable.",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let signedIn = false;
  try {
    const session = await getSession();
    signedIn = !!session?.user;
  } catch {
    signedIn = false;
  }
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Providers>
        <header className="sticky top-0 z-40 backdrop-blur bg-paper/80 border-b border-black/5">
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-ink text-paper flex items-center justify-center font-black text-lg">P</span>
              <span className="text-xl font-extrabold tracking-tight">Printables</span>
            </Link>
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
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-black/5 mt-24">
          <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-mute text-sm">
            <div>© Printables. Built for creators.</div>
            <div className="flex items-center gap-4">
              <Link href="/pricing" className="hover:text-ink">Pricing</Link>
              <a href="mailto:hello@99dfy.com" className="hover:text-ink">Support</a>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  );
}
