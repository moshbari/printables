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
  </div>
</body>
</html>`;
        if (!process.env.RESEND_API_KEY) {
          console.log("[auth] RESEND_API_KEY missing — sign-in URL:", url);
          return;
        }
        await resend.emails.send({
          from: process.env.RESEND_FROM || "Printables <noreply@99dfy.com>",
          to: identifier,
          subject,
          html,
        });
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
