import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  const ctaHref = session?.user ? "/generate" : "/signin";

  return (
    <div className="max-w-6xl mx-auto px-5">
      {/* Hero */}
      <section className="pt-20 pb-16 text-center fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-sm font-medium text-mute">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          Live demo — 60 seconds to your first printable
        </div>
        <h1 className="mt-6 text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
          <span className="gradient-title">Etsy-ready printables</span>
          <br />
          in 60 seconds.
        </h1>
        <p className="mt-6 text-xl text-mute max-w-2xl mx-auto">
          Type one idea. Click one button. Get a full PDF, title, tags, cover, and 5 Pinterest pins — ready to upload.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={ctaHref} className="btn-primary-xl">
            Make my first printable — free →
          </Link>
          <Link href="/pricing" className="btn-ghost">See pricing</Link>
        </div>
        <p className="mt-4 text-sm text-mute">No credit card. 1 free. $27/mo after that.</p>
      </section>

      {/* 1-2-3 */}
      <section className="mt-20 grid md:grid-cols-3 gap-6">
        {[
          { n: "1", h: "Type your idea", p: "Like “gratitude journal for busy moms.” That is it." },
          { n: "2", h: "Click Generate", p: "Our AI makes the PDF, cover, title, tags, and pins." },
          { n: "3", h: "Download ZIP", p: "Upload to Etsy. Post the pins to Pinterest. Done." },
        ].map((s) => (
          <div key={s.n} className="card p-8">
            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-xl">
              {s.n}
            </div>
            <h3 className="mt-5 text-2xl font-bold">{s.h}</h3>
            <p className="mt-2 text-mute text-lg leading-relaxed">{s.p}</p>
          </div>
        ))}
      </section>

      {/* Whats inside */}
      <section className="mt-24">
        <h2 className="text-3xl sm:text-4xl font-black text-center">Everything you need. Nothing you don't.</h2>
        <p className="mt-3 text-center text-mute text-lg max-w-2xl mx-auto">
          One click gives you the full Etsy listing, ready to paste. Plus bonus pins for free Pinterest traffic.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { t: "Printable PDF", d: "Clean, pretty pages. Letter-size. Ready to print.", e: "📄" },
            { t: "Etsy title + description", d: "Natural, buyer-friendly. No keyword stuffing.", e: "🏷️" },
            { t: "13 long-tail tags", d: "One-click copy. Paste into Etsy.", e: "🔎" },
            { t: "5 Pinterest pins", d: "Free traffic. Each pin is ready to post.", e: "📌" },
          ].map((f) => (
            <div key={f.t} className="card p-6">
              <div className="text-3xl">{f.e}</div>
              <h4 className="mt-3 text-lg font-bold">{f.t}</h4>
              <p className="mt-1 text-mute">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof */}
      <section className="mt-24 card p-10 bg-gradient-to-br from-white to-paper">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-black text-accent">93M</div>
            <div className="mt-2 text-mute">Etsy buyers waiting</div>
          </div>
          <div>
            <div className="text-5xl font-black text-accent">28%</div>
            <div className="mt-2 text-mute">of Etsy digital sales are printables</div>
          </div>
          <div>
            <div className="text-5xl font-black text-accent">$7</div>
            <div className="mt-2 text-mute">average printable sale price</div>
          </div>
        </div>
        <p className="mt-8 text-center text-mute max-w-2xl mx-auto">
          One real seller made <b className="text-ink">$6,161 in 4 months</b> with a brand new shop. Printables work.
        </p>
      </section>

      {/* Big CTA */}
      <section className="mt-24 text-center pb-24">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
          Your first printable is <span className="gradient-title">free</span>.
        </h2>
        <p className="mt-4 text-xl text-mute">Try it. If you love it, stay for $27/mo. Cancel anytime.</p>
        <div className="mt-8">
          <Link href={ctaHref} className="btn-primary-xl">Make my printable now →</Link>
        </div>
      </section>
    </div>
  );
}
