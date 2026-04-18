export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <div className="text-6xl">🤷</div>
      <h1 className="mt-4 text-3xl font-black">Page not found</h1>
      <p className="mt-2 text-mute">The link you clicked doesn&apos;t exist.</p>
      <a href="/" className="btn-primary mt-6 inline-flex">Go home</a>
    </div>
  );
}
