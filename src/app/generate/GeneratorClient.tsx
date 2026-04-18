"use client";
import { useState } from "react";
import Link from "next/link";
import { TEMPLATES, type TemplateId } from "@/lib/templates";
import CopyBtn from "@/components/CopyBtn";

type Result = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  price: number;
  pages: { heading: string; body: string }[];
  pins: { pin_title: string; pin_description: string }[];
  day_one_plan: string[];
  coverUrl?: string;
  zipUrl: string;
  pdfUrl: string;
};

const EXAMPLES = [
  "gratitude journal for busy moms",
  "30-day meal planner for beginners",
  "kids chore chart with stickers",
  "wedding planning checklist",
  "daily budget tracker for freelancers",
];

export default function GeneratorClient({
  tier,
  freeUsed,
}: {
  tier: "FREE" | "PRO";
  freeUsed: boolean;
}) {
  const [idea, setIdea] = useState("");
  const [template, setTemplate] = useState<TemplateId>("journal");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const [paywalled, setPaywalled] = useState(false);

  async function generate() {
    setError("");
    setPaywalled(false);
    if (!idea.trim()) {
      setError("Please type an idea first.");
      return;
    }
    setLoading(true);
    try {
      const stages = [
        "Writing your Etsy listing…",
        "Writing the PDF pages…",
        "Making the cover image…",
        "Building your Pinterest pins…",
        "Zipping it up…",
      ];
      let i = 0;
      setStatus(stages[0]);
      const tick = setInterval(() => {
        i = Math.min(i + 1, stages.length - 1);
        setStatus(stages[i]);
      }, 7000);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, template }),
      });
      clearInterval(tick);

      if (res.status === 402) {
        setPaywalled(true);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Something went wrong. Try again.");
      }
      const data = (await res.json()) as Result;
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  }

  function reset() {
    setResult(null);
    setIdea("");
    setError("");
    setStatus("");
  }

  // --- PAYWALL (manual access) ---
  if (paywalled) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16">
        <div className="card p-10 text-center">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-4 text-3xl font-black">You used your free one!</h1>
          <p className="mt-3 text-lg text-mute">
            Want unlimited printables? Ask for full access. One click.
          </p>
          <div className="mt-8 grid gap-3">
            <Link href="/pricing" className="btn-primary-xl w-full">
              Get full access
            </Link>
            <Link href="/dashboard" className="btn-ghost w-full">See my printable</Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT ---
  if (result) {
    const tagsText = result.tags.join(", ");
    return (
      <div className="max-w-4xl mx-auto px-5 py-10">
        <div className="card p-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-sm text-mute">Your printable is ready 🎉</div>
            <h1 className="text-2xl font-black">{result.title}</h1>
          </div>
          <div className="flex gap-3">
            <a href={result.zipUrl} className="btn-primary !px-6 !py-4 !text-lg" download>
              ⬇ Download ZIP
            </a>
            <button onClick={reset} className="btn-ghost">Make another</button>
          </div>
        </div>

        {/* Cover preview */}
        {result.coverUrl ? (
          <div className="mt-6 card p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.coverUrl} alt="cover" className="w-full rounded-2xl" />
          </div>
        ) : null}

        {/* Title + Description + Tags */}
        <div className="mt-6 grid gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Etsy title</h2>
              <CopyBtn value={result.title} label="Copy title" />
            </div>
            <p className="mt-3 text-lg">{result.title}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Etsy description</h2>
              <CopyBtn value={result.description} label="Copy description" />
            </div>
            <p className="mt-3 whitespace-pre-wrap text-mute leading-relaxed">{result.description}</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">13 Etsy tags</h2>
              <CopyBtn value={tagsText} label="Copy all tags" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.tags.map((t, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-paper border border-black/10 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Suggested price</h2>
              <CopyBtn value={String(result.price)} label="Copy price" />
            </div>
            <p className="mt-3 text-3xl font-black text-accent">${result.price.toFixed(2)}</p>
          </div>

          {/* Pins */}
          <div className="card p-6">
            <h2 className="text-xl font-bold">5 Pinterest pins</h2>
            <p className="text-mute">Post these for free traffic. Each one is ready to go.</p>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {result.pins.map((p, i) => (
                <div key={i} className="rounded-2xl border border-black/10 p-4 bg-paper">
                  <div className="font-bold">{p.pin_title}</div>
                  <p className="mt-1 text-sm text-mute">{p.pin_description}</p>
                  <div className="mt-3 flex gap-2">
                    <CopyBtn value={p.pin_title} label="Copy title" />
                    <CopyBtn value={p.pin_description} label="Copy text" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day 1 plan */}
          <div className="card p-6">
            <h2 className="text-xl font-bold">Day 1 launch plan</h2>
            <p className="text-mute">Do these 5 things today. You'll be live.</p>
            <ol className="mt-4 space-y-2">
              {result.day_one_plan.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-lg">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="card p-6 text-center">
            <h2 className="text-xl font-bold">Ready to upload?</h2>
            <p className="text-mute mt-1">Open Etsy and paste your title, description, and tags.</p>
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <a
                href="https://www.etsy.com/your/shops/me/tools/listings/create"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !px-6 !py-4 !text-lg"
              >
                Open Etsy listing page →
              </a>
              <a href={result.zipUrl} className="btn-dark" download>
                ⬇ Download ZIP again
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- INPUT FORM ---
  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-black">Make your printable</h1>
        <p className="mt-3 text-lg text-mute">
          Type one idea. Pick one style. Click one button.{" "}
          {tier === "FREE" && !freeUsed ? (
            <span className="font-semibold text-ink">Your first one is free.</span>
          ) : null}
        </p>
      </div>

      <div className="card p-8">
        <label className="block text-sm font-bold uppercase tracking-wider text-mute">
          1. Your idea
        </label>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={3}
          maxLength={280}
          placeholder="e.g. gratitude journal for busy moms"
          className="mt-2 w-full px-5 py-4 rounded-2xl border border-black/10 focus:border-accent outline-none text-xl resize-none"
          disabled={loading}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setIdea(ex)}
              disabled={loading}
              className="px-3 py-1.5 rounded-full bg-paper border border-black/10 text-sm hover:border-black/30"
            >
              {ex}
            </button>
          ))}
        </div>

        <label className="block mt-8 text-sm font-bold uppercase tracking-wider text-mute">
          2. Pick a style
        </label>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.id)}
              disabled={loading}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                template === t.id
                  ? "border-accent bg-accent/5 shadow-glow"
                  : "border-black/10 bg-white hover:border-black/30"
              }`}
            >
              <div className="text-3xl">{t.emoji}</div>
              <div className="mt-2 font-bold">{t.label}</div>
              <div className="text-sm text-mute">{t.blurb}</div>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button onClick={generate} disabled={loading} className="btn-primary-xl w-full disabled:opacity-60">
            {loading ? status || "Generating…" : "✨ Generate my printable"}
          </button>
          {loading ? (
            <div className="mt-3 text-center text-mute text-sm">
              Takes about 60 seconds. Do not close this page.
            </div>
          ) : null}
          {error ? <div className="mt-3 text-center text-red-600 text-sm">{error}</div> : null}
        </div>
      </div>
    </div>
  );
}
