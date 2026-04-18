"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ maxWidth: 640, margin: "80px auto", textAlign: "center", fontFamily: "sans-serif" }}>
          <div style={{ fontSize: 60 }}>⚠️</div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Something went wrong</h1>
          <p style={{ color: "#666", marginTop: 8 }}>Please try again.</p>
          <button onClick={() => reset()} style={{ marginTop: 20, padding: "12px 24px", background: "#111", color: "#fff", borderRadius: 12, border: 0, cursor: "pointer" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
