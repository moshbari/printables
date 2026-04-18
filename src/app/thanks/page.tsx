import Link from "next/link";

export default function Thanks() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-24">
      <div className="card p-12 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-4 text-4xl font-black">You're in!</h1>
        <p className="mt-3 text-lg text-mute">
          You now have unlimited printables. Go build your shop.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/generate" className="btn-primary-xl">Make a printable →</Link>
          <Link href="/dashboard" className="btn-ghost">My Printables</Link>
        </div>
      </div>
    </div>
  );
}
