import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getSession();
  if (!session?.user) redirect("/signin");
  const userId = (session.user as any).id as string;
  const tier = (session.user as any).tier || "FREE";
  const email = (session.user as any).email as string | undefined;

  const gens = await prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-4xl font-black">My Printables</h1>
          <p className="text-mute mt-1">
            Plan: <b>{tier === "PRO" ? "PRO — Unlimited" : "Free"}</b>
          </p>
          {email ? (
            <p className="text-mute text-sm mt-1">
              Signed in as <b className="text-ink">{email}</b>
            </p>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Link href="/generate" className="btn-primary">+ Make another</Link>
          {tier !== "PRO" ? (
            <Link href="/pricing" className="btn-ghost">Upgrade</Link>
          ) : null}
        </div>
      </div>

      {gens.length === 0 ? (
        <div className="card p-16 mt-10 text-center">
          <div className="text-6xl">📭</div>
          <h2 className="mt-4 text-2xl font-bold">No printables yet</h2>
          <p className="mt-2 text-mute">Click below to make your first one.</p>
          <div className="mt-6">
            <Link href="/generate" className="btn-primary-xl">Make my first printable</Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gens.map((g: any) => (
            <div key={g.id} className="card p-5">
              <div className="text-xs font-bold uppercase text-mute">{g.template}</div>
              <div className="mt-1 font-bold text-lg line-clamp-2">{g.title || g.idea}</div>
              <div className="mt-2 text-sm text-mute line-clamp-3">{g.description || "—"}</div>
              <div className="mt-4 flex gap-2">
                <Link href={`/generate?id=${g.id}`} className="btn-ghost !px-3 !py-2 !text-sm">View</Link>
                {g.zipPath ? (
                  <a href={`/api/download/${g.id}`} download className="btn-primary !px-3 !py-2 !text-sm">⬇ ZIP</a>
                ) : (
                  <span className="text-sm text-mute self-center">Building…</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
