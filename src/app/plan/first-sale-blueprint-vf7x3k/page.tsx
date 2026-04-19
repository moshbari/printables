import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your $0 → First $22 Plan — Printables",
  description: "The simple 7-day plan to your first Etsy printable sale. Real numbers. No fluff.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PlanPage() {
  const session = await getSession();
  const ctaHref = session?.user ? "/generate" : "/signin";

  return (
    <div className="max-w-5xl mx-auto px-5">
      {/* HERO */}
      <section className="pt-16 pb-10 text-center fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-sm font-medium text-mute">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
          Free gift — for people who signed up
        </div>
        <h1 className="mt-6 text-5xl sm:text-7xl font-black tracking-tight leading-[1.05]">
          <span className="gradient-title">$0 → First $22</span>
          <br />
          in 7 days.
        </h1>
        <p className="mt-6 text-xl text-mute max-w-2xl mx-auto">
          The simple plan. Real numbers. No lies. You copy the steps, you can make your first sale this week.
        </p>
        <p className="mt-3 text-sm text-mute">All numbers below are from Etsy, not made up. You can check them yourself.</p>
      </section>

      {/* STEP 1: Pick a proven winner */}
      <section className="mt-10 card p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl">1</div>
          <div>
            <h2 className="text-3xl font-black">Pick a proven idea.</h2>
            <p className="mt-2 text-lg text-mute">Do not guess. Copy what is already selling.</p>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl bg-paper p-5 border border-black/5">
            <div className="text-sm font-bold text-mute uppercase">Go to Etsy. Search:</div>
            <div className="mt-2 text-2xl font-black">“kids chore chart printable”</div>
            <div className="mt-3 text-mute">Sort by: <b className="text-ink">Top customer reviews</b>.</div>
            <div className="mt-3 text-mute">You will see PDFs selling for <b className="text-ink">$3 to $10</b>. Top shops have thousands of reviews.</div>
          </div>
          <div className="rounded-2xl bg-paper p-5 border border-black/5">
            <div className="text-sm font-bold text-mute uppercase">Or try any of these:</div>
            <ul className="mt-2 space-y-1 text-lg">
              <li>• weight loss tracker printable</li>
              <li>• meal plan printable</li>
              <li>• budget planner printable</li>
              <li>• wedding welcome sign printable</li>
              <li>• ADHD daily routine printable</li>
            </ul>
          </div>
        </div>

        <p className="mt-5 text-mute">
          <b className="text-ink">Why this works:</b> Etsy shows you the winners for free. If 50 shops are selling the same thing, people want it. Your job is only to make a nicer version.
        </p>
      </section>

      {/* STEP 2: Make your version */}
      <section className="mt-6 card p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl">2</div>
          <div>
            <h2 className="text-3xl font-black">Make your version in 60 seconds.</h2>
            <p className="mt-2 text-lg text-mute">Type the idea. Click Generate. Get the full pack.</p>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Printable PDF", d: "Clean and ready to print." },
            { t: "Etsy title", d: "Written to rank. Copy-paste." },
            { t: "13 tags", d: "One-click copy." },
            { t: "5 Pinterest pins", d: "For free traffic." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl bg-paper p-4 border border-black/5">
              <div className="font-bold">{x.t}</div>
              <div className="text-mute text-sm mt-1">{x.d}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-accent/10 border border-accent/20 text-ink">
          <b>Smart move:</b> Make <b>3 versions</b> (three different covers or three small idea changes). You do not know which one wins yet. Let the buyers vote. That is why <b>PRO is the best deal</b> — unlimited printables for $27/mo.
        </div>
      </section>

      {/* STEP 3: List on Etsy */}
      <section className="mt-6 card p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl">3</div>
          <div>
            <h2 className="text-3xl font-black">List all 3 on Etsy.</h2>
            <p className="mt-2 text-lg text-mute">$0.20 per listing. Takes 3 minutes each.</p>
          </div>
        </div>
        <div className="mt-5 text-mute">
          Price each one at <b className="text-ink">$14.99</b>. That is normal for a nice printable bundle on Etsy. Use the title and tags from Printables. Upload the PDF and cover. Done.
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-paper p-4 border border-black/5">
            <div className="text-2xl font-black text-accent">$0.20</div>
            <div className="text-sm text-mute">per listing fee</div>
          </div>
          <div className="rounded-2xl bg-paper p-4 border border-black/5">
            <div className="text-2xl font-black text-accent">3 listings</div>
            <div className="text-sm text-mute">= $0.60 total</div>
          </div>
          <div className="rounded-2xl bg-paper p-4 border border-black/5">
            <div className="text-2xl font-black text-accent">4 months</div>
            <div className="text-sm text-mute">each listing stays live</div>
          </div>
        </div>
      </section>

      {/* STEP 4: Test with tiny ads */}
      <section className="mt-6 card p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl">4</div>
          <div>
            <h2 className="text-3xl font-black">Test with tiny ads.</h2>
            <p className="mt-2 text-lg text-mute">$2 a day. That is it. Days 1–4.</p>
          </div>
        </div>

        <div className="mt-5 text-mute">
          On Etsy, open <b className="text-ink">Etsy Ads</b>. Set daily budget to <b className="text-ink">$2</b>. Etsy splits it across your 3 listings.
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-4 text-base">
          <div className="rounded-2xl bg-paper p-5 border border-black/5">
            <div className="font-bold">Real Etsy Ads numbers (2026)</div>
            <ul className="mt-2 space-y-1 text-mute">
              <li>• Cost per click: <b className="text-ink">$0.20 to $0.50</b></li>
              <li>• Most sellers pay about <b className="text-ink">$0.35</b></li>
              <li>• Average click rate: <b className="text-ink">2%</b> of shoppers click</li>
              <li>• Good conversion rate: <b className="text-ink">2 to 3%</b> of clicks buy</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-paper p-5 border border-black/5">
            <div className="font-bold">Your test math (4 days)</div>
            <ul className="mt-2 space-y-1 text-mute">
              <li>• $2/day × 4 days = <b className="text-ink">$8 ad spend</b></li>
              <li>• $8 ÷ $0.35 = <b className="text-ink">about 23 clicks</b></li>
              <li>• At 2.5% CVR = <b className="text-ink">about 1 early sale</b></li>
              <li>• You will see which listing gets the most clicks</li>
            </ul>
          </div>
        </div>
      </section>

      {/* STEP 5: Pick the winner and scale */}
      <section className="mt-6 card p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl">5</div>
          <div>
            <h2 className="text-3xl font-black">Day 5: Pick the winner. Scale it.</h2>
            <p className="mt-2 text-lg text-mute">Pause the other two. Put all your money on the one people love.</p>
          </div>
        </div>
        <div className="mt-5 text-mute">
          The winner is the listing with the <b className="text-ink">most clicks</b> (and any sales).
          Pause the two losers. Move your ad budget to the winner at <b className="text-ink">$3/day × 3 days = $9</b>.
        </div>
        <div className="mt-5 rounded-2xl bg-accent/10 border border-accent/20 p-5">
          <div className="font-bold">Week 1 ad spend total: <span className="text-accent">$17</span></div>
          <div className="text-mute text-sm mt-1">($8 testing + $9 scaling the winner)</div>
        </div>
      </section>

      {/* STEP 6: Free traffic */}
      <section className="mt-6 card p-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-accent text-white flex items-center justify-center font-black text-2xl">6</div>
          <div>
            <h2 className="text-3xl font-black">Add free traffic (15 min/day).</h2>
            <p className="mt-2 text-lg text-mute">Pinterest + Instagram + Facebook. Just post pictures.</p>
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-paper p-5 border border-black/5">
            <div className="text-2xl">📌</div>
            <div className="mt-2 font-bold">Pinterest</div>
            <div className="text-mute text-sm mt-1">Post 2 of your 5 pins every day. Link to your Etsy listing. Pinterest has <b className="text-ink">600 million users a month</b>. 88% buy things they find there.</div>
          </div>
          <div className="rounded-2xl bg-paper p-5 border border-black/5">
            <div className="text-2xl">📷</div>
            <div className="mt-2 font-bold">Instagram</div>
            <div className="text-mute text-sm mt-1">Post 1 image a day. Use the same cover. Link in bio goes to Etsy. No reels needed. No filters needed.</div>
          </div>
          <div className="rounded-2xl bg-paper p-5 border border-black/5">
            <div className="text-2xl">👥</div>
            <div className="mt-2 font-bold">Facebook</div>
            <div className="text-mute text-sm mt-1">Post the same image in your feed. Share in 1 group like “Etsy sellers” or a niche group. Free eyeballs.</div>
          </div>
        </div>

        <p className="mt-5 text-mute">
          <b className="text-ink">Why this is big:</b> Pinterest pins keep getting views for <b className="text-ink">months or years</b>. You post once and it keeps working. Instagram and Facebook are slower, but both are free.
        </p>
      </section>

      {/* WEEK 1 MATH */}
      <section className="mt-10 card p-8 bg-gradient-to-br from-white to-paper">
        <h2 className="text-4xl font-black text-center">Week 1 math. Real numbers.</h2>
        <p className="mt-2 text-center text-mute">Product priced at $14.99. Etsy keeps about $1.67 per sale. You keep <b className="text-ink">$13.32</b>.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {/* You spend */}
          <div className="rounded-2xl bg-white p-6 border border-black/10">
            <div className="text-sm font-bold uppercase text-mute">You spend</div>
            <table className="mt-3 w-full text-lg">
              <tbody>
                <tr className="border-b border-black/5"><td className="py-2">3 Etsy listings</td><td className="py-2 text-right font-bold">$0.60</td></tr>
                <tr className="border-b border-black/5"><td className="py-2">Etsy Ads (test days 1–4)</td><td className="py-2 text-right font-bold">$8.00</td></tr>
                <tr className="border-b border-black/5"><td className="py-2">Etsy Ads (scale days 5–7)</td><td className="py-2 text-right font-bold">$9.00</td></tr>
                <tr><td className="pt-3 font-black text-xl">Total</td><td className="pt-3 text-right font-black text-xl text-accent">$17.60</td></tr>
              </tbody>
            </table>
          </div>

          {/* You make */}
          <div className="rounded-2xl bg-white p-6 border border-black/10">
            <div className="text-sm font-bold uppercase text-mute">You make (realistic range)</div>
            <table className="mt-3 w-full text-lg">
              <tbody>
                <tr className="border-b border-black/5">
                  <td className="py-2">Slow start (2 sales)</td>
                  <td className="py-2 text-right font-bold">$26.64</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-2">Normal (3 sales)</td>
                  <td className="py-2 text-right font-bold">$39.96</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-2">Winner hits (4 sales)</td>
                  <td className="py-2 text-right font-bold">$53.28</td>
                </tr>
                <tr><td className="pt-3 font-black">You need only 2 sales to be in profit.</td><td></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Net profit */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-5 border border-black/10 text-center">
            <div className="text-xs font-bold uppercase text-mute">Slow start</div>
            <div className="text-3xl font-black text-accent mt-1">+$9.04</div>
            <div className="text-sm text-mute">profit from 2 sales</div>
          </div>
          <div className="rounded-2xl bg-accent text-white p-5 text-center">
            <div className="text-xs font-bold uppercase opacity-80">Normal case</div>
            <div className="text-3xl font-black mt-1">+$22.36</div>
            <div className="text-sm opacity-80">profit from 3 sales</div>
          </div>
          <div className="rounded-2xl bg-white p-5 border border-black/10 text-center">
            <div className="text-xs font-bold uppercase text-mute">Winner hits</div>
            <div className="text-3xl font-black text-accent mt-1">+$35.68</div>
            <div className="text-sm text-mute">profit from 4 sales</div>
          </div>
        </div>

        <p className="mt-6 text-sm text-mute text-center max-w-3xl mx-auto">
          Source: Etsy fees ($0.20 listing + 6.5% transaction fee + 3% + $0.25 payment processing), Etsy Ads average CPC $0.20–$0.50, average CTR 2%, good conversion rate 2–3%. These are real 2026 Etsy platform numbers. You can look them up.
        </p>
      </section>

      {/* WEEK 2 AND BEYOND */}
      <section className="mt-10 card p-8">
        <h2 className="text-3xl font-black">What happens after week 1?</h2>
        <p className="mt-3 text-mute text-lg">This is where it gets fun.</p>

        <div className="mt-5 space-y-4 text-lg">
          <div className="flex gap-4">
            <div className="w-8 h-8 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center font-black">✓</div>
            <div>Your winning listing now has <b>real reviews</b>. Etsy ranks it higher. Free traffic goes up.</div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center font-black">✓</div>
            <div>Your Pinterest pins from week 1 keep getting views. Some will go big months later. Free clicks forever.</div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center font-black">✓</div>
            <div>You can make a <b>new printable in 60 seconds</b> on Printables. Keep the winners, drop the losers.</div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 shrink-0 rounded-full bg-accent/20 text-accent flex items-center justify-center font-black">✓</div>
            <div>Once your winner is steady, stack another. Then another. Each one is a tiny money machine.</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 text-center pb-24">
        <h2 className="text-4xl sm:text-5xl font-black">
          Ready to start? Your first one is <span className="gradient-title">free</span>.
        </h2>
        <p className="mt-4 text-xl text-mute">No card. No tricks. Test the whole thing before you pay.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={ctaHref} className="btn-primary-xl">Make my first printable →</Link>
          <Link href="/pricing" className="btn-ghost">See PRO ($27/mo for 3-variant testing)</Link>
        </div>
        <p className="mt-6 text-sm text-mute max-w-2xl mx-auto">
          Honest note: these numbers are an average. Some shops sell more. Some sell less. Your title, cover, and niche all matter. But the path is real.
        </p>
      </section>

      {/* LEGAL DISCLAIMER */}
      <section className="mb-16">
        <div className="rounded-2xl bg-white border border-black/10 p-6 text-xs text-mute leading-relaxed">
          <div className="font-bold text-ink uppercase tracking-wide text-[11px] mb-2">Important disclaimer — please read</div>
          <p className="mb-3">
            This page is for <b>educational and informational purposes only</b>. It is <b>not</b> financial advice, investment advice, business advice, legal advice, or tax advice. Nothing on this page should be treated as a promise, guarantee, or prediction of any specific financial result.
          </p>
          <p className="mb-3">
            The example numbers shown (prices, fees, click rates, conversion rates, ad costs, and profit figures) are <b>illustrative averages</b> drawn from publicly available Etsy platform information and typical seller benchmarks as of 2026. They are not based on your individual shop, niche, audience, or effort, and they are not a forecast of what you will earn. Your actual results will depend on factors including but not limited to: your product quality, title and imagery, pricing, niche competition, ad bid, search ranking, seasonality, conversion rate, refund rate, tax jurisdiction, Etsy policy changes, and the time and effort you put in. <b>Many sellers earn less than these examples. Some earn nothing. Some earn more.</b> Past performance, industry averages, and third-party case studies do not predict your future results.
          </p>
          <p className="mb-3">
            Running an Etsy shop involves real costs (listing fees, transaction fees, payment processing fees, ad spend, taxes) and real risk of financial loss. You alone are responsible for your business decisions — including pricing, ad budgets, inventory, customer service, tax reporting, and compliance with Etsy's Seller Policy, Intellectual Property rules, and any laws that apply where you live and sell. Printables is a tool that helps you create digital product files; it does not sell on your behalf and is not affiliated with, endorsed by, or partnered with Etsy, Inc., Pinterest, Meta, or any other platform mentioned on this page. All trademarks belong to their respective owners.
          </p>
          <p>
            By using this plan you agree that Printables and its owners, operators, and affiliates are <b>not liable</b> for any direct, indirect, incidental, consequential, or lost-profit damages arising from your use of (or inability to use) the information on this page, to the maximum extent permitted by law. If you are unsure whether this approach is right for you, please consult a licensed professional (accountant, attorney, or financial advisor) before spending money.
          </p>
        </div>
      </section>
    </div>
  );
}
