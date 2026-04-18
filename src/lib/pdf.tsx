/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from "@react-pdf/renderer";

// Palette — consistent with the web app
const C = {
  bg: "#FAF7F2",        // cream paper
  ink: "#0B0B10",       // near-black
  body: "#2A2A33",      // body text
  muted: "#6B6B75",     // secondary
  line: "#C9C4BB",      // writing lines
  accent: "#FF7A1A",    // brand orange
  softCard: "#FFFFFFCC" // translucent overlay
};

const styles = StyleSheet.create({
  // ---- base page ----
  page: {
    paddingTop: 56,
    paddingHorizontal: 56,
    paddingBottom: 64,
    backgroundColor: C.bg,
    color: C.ink,
    fontFamily: "Times-Roman",
  },
  // ---- cover ----
  coverPage: { padding: 0, backgroundColor: C.bg },
  coverBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" },
  coverFrame: {
    position: "absolute", top: 160, left: 64, right: 64,
    paddingVertical: 44, paddingHorizontal: 40,
    backgroundColor: C.softCard,
    alignItems: "center",
    borderRadius: 6,
  },
  coverKicker: { fontFamily: "Helvetica", fontSize: 10, letterSpacing: 4, color: C.muted, marginBottom: 14 },
  coverTitle: { fontFamily: "Times-Bold", fontSize: 30, textAlign: "center", color: C.ink, lineHeight: 1.2 },
  coverAccent: { width: 56, height: 3, backgroundColor: C.accent, marginTop: 22, marginBottom: 14 },
  coverSub: { fontFamily: "Times-Italic", fontSize: 13, color: C.muted, textAlign: "center" },
  coverFallback: {
    flex: 1, justifyContent: "center", alignItems: "center",
    padding: 72, backgroundColor: C.bg,
  },

  // ---- page header ----
  pageTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 },
  heading: { fontFamily: "Times-Bold", fontSize: 24, color: C.ink },
  dateRow: { flexDirection: "row", alignItems: "center" },
  dateLabel: { fontFamily: "Helvetica", fontSize: 9, color: C.muted, marginRight: 6, letterSpacing: 2 },
  dateLine: { width: 110, height: 1, backgroundColor: C.line, alignSelf: "flex-end", marginBottom: 2 },
  accent: { width: 44, height: 3, backgroundColor: C.accent, marginBottom: 18 },

  // ---- prompt blocks ----
  prompt: { fontFamily: "Times-Bold", fontSize: 12, color: C.ink, marginBottom: 8, marginTop: 4 },
  writeLine: { borderBottomWidth: 0.8, borderBottomColor: C.line, height: 22 },
  promptBlock: { marginBottom: 16 },

  // ---- body prose ----
  body: { fontFamily: "Times-Roman", fontSize: 12, lineHeight: 1.6, color: C.body, marginBottom: 10 },

  // ---- trackers ----
  trackerSub: { fontFamily: "Helvetica", fontSize: 10, color: C.muted, marginBottom: 18 },
  trackerGrid: { flexDirection: "row", flexWrap: "wrap" },
  trackerCell: {
    width: 56, height: 56, margin: 4,
    borderWidth: 0.8, borderColor: C.line, borderRadius: 4,
    alignItems: "center", justifyContent: "center",
  },
  trackerNum: { fontFamily: "Helvetica", fontSize: 10, color: C.muted },

  weekRow: {
    flexDirection: "row",
    borderBottomWidth: 0.6, borderBottomColor: C.line,
    paddingVertical: 14,
  },
  weekDay: { width: 70, fontFamily: "Helvetica-Bold", fontSize: 11, color: C.ink },
  weekLines: { flex: 1, justifyContent: "center" },
  weekLine: { borderBottomWidth: 0.6, borderBottomColor: C.line, height: 18 },

  // ---- footer ----
  pageNum: {
    position: "absolute",
    bottom: 28, left: 0, right: 0,
    fontFamily: "Helvetica", fontSize: 9, color: C.muted,
    textAlign: "center", letterSpacing: 2,
  },
  backMatter: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 72,
  },
  thanksTitle: { fontFamily: "Times-Bold", fontSize: 22, color: C.ink, marginBottom: 12 },
  thanksBody: { fontFamily: "Times-Italic", fontSize: 13, color: C.muted, textAlign: "center", marginBottom: 24, lineHeight: 1.6 },
  attribution: { fontFamily: "Helvetica", fontSize: 8, color: C.muted, letterSpacing: 1 },
});

export type PdfPage = { heading: string; body: string };

// ---- small primitives ----
function PromptBlock({ text, lines = 3 }: { text: string; lines?: number }) {
  const arr = Array.from({ length: lines });
  return (
    <View style={styles.promptBlock}>
      <Text style={styles.prompt}>{text}</Text>
      {arr.map((_, i) => (
        <View key={i} style={styles.writeLine} />
      ))}
    </View>
  );
}

function PageHeader({ heading, showDate = true }: { heading: string; showDate?: boolean }) {
  return (
    <>
      <View style={styles.pageTop}>
        <Text style={styles.heading}>{heading}</Text>
        {showDate ? (
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>DATE</Text>
            <View style={styles.dateLine} />
          </View>
        ) : null}
      </View>
      <View style={styles.accent} />
    </>
  );
}

function PageNumber({ n, total }: { n: number; total: number }) {
  const pad = (x: number) => (x < 10 ? `0${x}` : `${x}`);
  return <Text style={styles.pageNum} fixed>— {pad(n)} / {pad(total)} —</Text>;
}

// Break a body string into prompt-like lines. Empty lines are ignored.
function splitPrompts(body: string): string[] {
  return (body || "")
    .split(/\n+/)
    .map((s) => s.replace(/^[-•*]\s+/, "").replace(/^\d+[.)]\s+/, "").trim())
    .filter(Boolean);
}

export async function renderListingPdf(opts: {
  title: string;
  pages: PdfPage[];
  coverBase64?: string;
}): Promise<Buffer> {
  const { title, pages, coverBase64 } = opts;

  // Build all interior pages first so we know the total page count for numbering
  type Interior = { key: string; node: React.ReactNode };
  const interior: Interior[] = [];

  // 1. Prompt pages derived from LLM output
  pages.forEach((p, i) => {
    const prompts = splitPrompts(p.body);
    // If there are no prompt-like lines, fall back to showing body as prose
    const hasPrompts = prompts.length > 0 && prompts.every((s) => s.length < 140);
    interior.push({
      key: `prompt-${i}`,
      node: (
        <>
          <PageHeader heading={p.heading || "Journal"} />
          {hasPrompts
            ? prompts.slice(0, 5).map((t, j) => <PromptBlock key={j} text={t} lines={3} />)
            : <Text style={styles.body}>{p.body}</Text>}
        </>
      ),
    });
  });

  // 2. 30-Day Tracker
  interior.push({
    key: "tracker",
    node: (
      <>
        <PageHeader heading="30-Day Tracker" showDate={false} />
        <Text style={styles.trackerSub}>
          Shade in a circle for every day you show up. Small steps add up.
        </Text>
        <View style={styles.trackerGrid}>
          {Array.from({ length: 30 }).map((_, i) => (
            <View key={i} style={styles.trackerCell}>
              <Text style={styles.trackerNum}>{i + 1}</Text>
            </View>
          ))}
        </View>
      </>
    ),
  });

  // 3. Weekly Reflection Spread
  interior.push({
    key: "weekly",
    node: (
      <>
        <PageHeader heading="Weekly Reflection" />
        <Text style={styles.trackerSub}>One short note per day. Keep it honest.</Text>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
          <View style={styles.weekRow} key={d}>
            <Text style={styles.weekDay}>{d}</Text>
            <View style={styles.weekLines}>
              <View style={styles.weekLine} />
              <View style={styles.weekLine} />
            </View>
          </View>
        ))}
      </>
    ),
  });

  // 4. Notes page
  interior.push({
    key: "notes",
    node: (
      <>
        <PageHeader heading="Notes & Thoughts" />
        {Array.from({ length: 22 }).map((_, i) => (
          <View key={i} style={styles.writeLine} />
        ))}
      </>
    ),
  });

  const totalInterior = interior.length;

  const Doc = (
    <Document title={title} author="Printables">
      {/* ---- Cover ---- */}
      <Page size="LETTER" style={styles.coverPage}>
        {coverBase64 ? (
          <Image src={`data:image/png;base64,${coverBase64}`} style={styles.coverBg} />
        ) : null}
        <View style={styles.coverFrame}>
          <Text style={styles.coverKicker}>PRINTABLES</Text>
          <Text style={styles.coverTitle}>{title}</Text>
          <View style={styles.coverAccent} />
          <Text style={styles.coverSub}>A printable journal you can use today</Text>
        </View>
      </Page>

      {/* ---- Interior pages ---- */}
      {interior.map((it, idx) => (
        <Page size="LETTER" style={styles.page} key={it.key}>
          {it.node}
          <PageNumber n={idx + 1} total={totalInterior} />
        </Page>
      ))}

      {/* ---- Back matter / Thank you ---- */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.backMatter}>
          <Text style={styles.thanksTitle}>Thank you</Text>
          <Text style={styles.thanksBody}>
            This printable was made just for you. Print the pages you need, as many times as you like.
            One page a day is enough.
          </Text>
          <Text style={styles.attribution}>printables.99dfy.com</Text>
        </View>
      </Page>
    </Document>
  );

  return await renderToBuffer(Doc as any);
}
