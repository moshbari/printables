/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer, Font } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingHorizontal: 56,
    paddingBottom: 64,
    backgroundColor: "#FAF7F2",
    color: "#0B0B10",
    fontFamily: "Helvetica",
  },
  coverPage: {
    padding: 0,
    backgroundColor: "#FAF7F2",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  coverFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 72,
    backgroundColor: "#FAF7F2",
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    textAlign: "center",
    color: "#0B0B10",
    marginBottom: 16,
  },
  coverAccent: {
    width: 80,
    height: 4,
    backgroundColor: "#FF7A1A",
    marginTop: 20,
  },
  h1: { fontSize: 26, fontWeight: 700, marginBottom: 10, color: "#0B0B10" },
  h2: { fontSize: 18, fontWeight: 700, marginTop: 20, marginBottom: 8, color: "#0B0B10" },
  accent: { width: 48, height: 3, backgroundColor: "#FF7A1A", marginBottom: 22 },
  body: { fontSize: 12, lineHeight: 1.6, color: "#2A2A33", marginBottom: 10 },
  bullet: { fontSize: 12, lineHeight: 1.7, color: "#2A2A33", marginBottom: 6 },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    fontSize: 9,
    color: "#9B9BA5",
    textAlign: "center",
  },
});

export type PdfPage = { heading: string; body: string };

export async function renderListingPdf(opts: {
  title: string;
  pages: PdfPage[];
  coverBase64?: string;
}): Promise<Buffer> {
  const { title, pages, coverBase64 } = opts;

  const Doc = (
    <Document title={title} author="Printables">
      {/* Cover */}
      <Page size="LETTER" style={styles.coverPage}>
        {coverBase64 ? (
          <Image src={`data:image/png;base64,${coverBase64}`} style={styles.coverImage} />
        ) : (
          <View style={styles.coverFallback}>
            <Text style={styles.coverTitle}>{title}</Text>
            <View style={styles.coverAccent} />
          </View>
        )}
      </Page>

      {/* Content pages */}
      {pages.map((p, i) => (
        <Page size="LETTER" style={styles.page} key={i}>
          <Text style={styles.h1}>{p.heading}</Text>
          <View style={styles.accent} />
          {p.body.split(/\n+/).map((line, j) => {
            const t = line.trim();
            if (!t) return null;
            if (/^[-•*]\s+/.test(t)) {
              return (
                <Text key={j} style={styles.bullet}>
                  {"•  " + t.replace(/^[-•*]\s+/, "")}
                </Text>
              );
            }
            if (/^\d+[.)]\s+/.test(t)) {
              return (
                <Text key={j} style={styles.bullet}>
                  {t}
                </Text>
              );
            }
            return (
              <Text key={j} style={styles.body}>
                {t}
              </Text>
            );
          })}
          <Text style={styles.footer}>Made with Printables • printables.99dfy.com</Text>
        </Page>
      ))}
    </Document>
  );

  return await renderToBuffer(Doc as any);
}
