# CLAUDE.md — Printables

## Standing instruction (read first)

Before doing work on this project, fetch and read the playbook at:

**https://github.com/moshbari/claude-playbook**

The playbook has Mosh's standing rules for writing, UX, SaaS launches, and infra. They apply here.

Files to read for common Printables work:
- `WRITING_STYLE.md` — 5th-grade reading level rule
- `UX_CLICK_ONLY.md` — click-only UX, grandma test
- `SAAS_LAUNCH_CHECKLIST.md` — billing webhook + auth checklist (this is how Printables is set up)
- `INFRA_HETZNER_COOLIFY.md` — Printables ships on Hetzner via Coolify
- `PROJECTS.md` — Printables entry with stack details

## When new lessons come up

Save them to the playbook repo, not just to this project. Local project notes don't travel to future Claude sessions on other surfaces.

## Printables-specific quick reference

- **Live site:** https://printables.99dfy.com
- **Stack:** Next.js 14 App Router (standalone), Prisma + Postgres, NextAuth magic-link, Whop billing
- **Billing:** Whop product `prod_nGDbEhFtK7JAO`, $37/mo. Webhook at `/api/whop-webhook`.
- **Deploy:** Coolify on Hetzner (`178.156.240.200:8000`). Coolify does NOT auto-deploy from `git push` — click Redeploy manually after each push until that webhook is wired.
