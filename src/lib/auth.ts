import NextAuth, { type NextAuthOptions, getServerSession } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "database" },
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?check=1",
  },
  providers: [
    EmailProvider({
      from: process.env.RESEND_FROM || "Printables <noreply@99dfy.com>",
      sendVerificationRequest: async ({ identifier, url }) => {
        const brand = "Printables";
        const subject = `Your ${brand} sign-in link`;
        const siteBase = process.env.NEXTAUTH_URL || "https://printables.99dfy.com";
        const giftUrl = `${siteBase.replace(/\/$/, "")}/plan/first-sale-blueprint-vf7x3k`;
        const html = `
<!doctype html>
<html>
<body style="margin:0;background:#FAF7F2;font-family:ui-sans-serif,system-ui,Inter,sans-serif;color:#0B0B10;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="font-size:28px;font-weight:800;letter-spacing:-0.02em;">Printables</div>
    <div style="margin-top:28px;background:#fff;border-radius:16px;padding:32px;box-shadow:0 10px 30px -15px rgba(0,0,0,0.15);">
      <h1 style="margin:0 0 12px;font-size:22px;">One click to sign in</h1>
      <p style="margin:0 0 24px;color:#6B6B75;line-height:1.6;">Click the big button. You are in.</p>
      <a href="${url}" style="display:inline-block;background:#FF7A1A;color:#fff;padding:16px 28px;border-radius:12px;font-weight:700;text-decoration:none;font-size:17px;">Sign me in</a>
      <p style="margin:28px 0 0;color:#6B6B75;font-size:13px;line-height:1.6;">Link is good for 24 hours. If you didn't ask for this, just ignore it.</p>
    </div>

    <div style="margin-top:20px;background:#fff;border-radius:16px;padding:24px;border:2px solid rgba(255,122,26,0.25);">
      <div style="font-size:12px;font-weight:700;color:#FF7A1A;text-transform:uppercase;letter-spacing:0.04em;">🎁 Your free gift</div>
      <div style="font-size:18px;font-weight:800;margin-top:6px;">$0 → $22 in 7 days — simple plan</div>
      <p style="margin:8px 0 14px;color:#6B6B75;line-height:1.6;font-size:14px;">Real numbers. No lies. A step-by-step path to your first Etsy sale this week.</p>
      <a href="${giftUrl}" style="display:inline-block;background:#0B0B10;color:#fff;padding:12px 20px;border-radius:10px;font-weight:700;text-decoration:none;font-size:14px;">Open my free plan →</a>
    </div>
  </div>
</body>
</html>`;
        // Always log the sign-in URL so ops can recover if email fails
        console.log("[auth] sign-in URL for", identifier, "=>", url);
        if (!process.env.RESEND_API_KEY) {
          console.log("[auth] RESEND_API_KEY missing — skipping send");
          return;
        }
        const result = await resend.emails.send({
          from: process.env.RESEND_FROM || "Printables <noreply@99dfy.com>",
          to: identifier,
          subject,
          html,
        });
        if ((result as any)?.error) {
          console.error("[auth] Resend send failed:", (result as any).error);
          throw new Error(`Resend: ${JSON.stringify((result as any).error)}`);
        }
        console.log("[auth] magic link sent to", identifier, "id=", (result as any)?.data?.id);
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        const u = await prisma.user.findUnique({
          where: { id: user.id },
          select: { tier: true, freeUsed: true, subEndsAt: true },
        });
        (session.user as any).tier = u?.tier ?? "FREE";
        (session.user as any).freeUsed = u?.freeUsed ?? false;
        (session.user as any).subEndsAt = u?.subEndsAt ?? null;
      }
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);
