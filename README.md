# Printables

AI generates Etsy-ready PDF printables in 60 seconds.

**Flow:** Type idea → Click Generate → Download ZIP (PDF + cover + listing text + Pinterest pins).

## Stack

- Next.js 14 (App Router) + TypeScript
- Postgres + Prisma
- NextAuth magic-link email (Resend)
- OpenAI (GPT-4o-mini for listing, DALL-E 3 for cover)
- Stripe ($27/mo subscription)
- `@react-pdf/renderer` for PDF output
- `archiver` for ZIP bundling
- Tailwind CSS

## Local dev

```bash
cp .env.example .env.local   # fill in real keys
npm install
npm run db:push              # create tables in your dev Postgres
npm run dev                  # http://localhost:3000
```

Required env vars (see `.env.example`):

| Var | What |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `NEXTAUTH_SECRET` | random long string |
| `NEXTAUTH_URL` | full public URL |
| `OPENAI_API_KEY` | OpenAI |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `STRIPE_PRICE_ID` | Price id for the $27/mo plan |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `RESEND_API_KEY` | Resend key |
| `RESEND_FROM` | e.g. `Printables <noreply@99dfy.com>` |
| `STORAGE_DIR` | Disk path for generated files (default `/app/storage`) |

## Deploy — Hetzner + Coolify

1. Push this repo to GitHub.
2. In Coolify: **New Application → Public/Private Git**, connect this repo.
3. Build pack: **Dockerfile**.
4. Add a sibling **Postgres** service, note its internal hostname.
5. Set env vars in the Coolify UI (same list as above).
6. Add a **persistent volume** mounted at `/app/storage`.
7. Point domain `printables.99dfy.com` at the app — Coolify auto-issues Let's Encrypt.
8. In Stripe, create a webhook to `https://printables.99dfy.com/api/stripe/webhook` for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
9. Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

Auto-deploy: enable GitHub push webhook in Coolify.

## One-file test

`GET /api/health` → `{ ok: true }`

## Fair use

- Free tier: 1 printable, then paywall.
- PRO: 200 printables per rolling 30 days (soft cap). Most users never hit it.
