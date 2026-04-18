import AdminGrantForm from "./AdminGrantForm";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      <h1 className="text-4xl font-black">Admin — Grant access</h1>
      <p className="mt-3 text-mute">
        Paste the buyer's email. Click the button. They're in.
      </p>
      <div className="mt-8 card p-8">
        <AdminGrantForm />
      </div>
      <p className="mt-6 text-sm text-mute">
        This page is protected by your admin token. Nobody else can use it.
      </p>
    </div>
  );
}
