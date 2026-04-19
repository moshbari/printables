# ---- deps ----
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma
# Force install of devDependencies regardless of NODE_ENV build-arg
RUN NODE_ENV=development npm ci --include=dev || NODE_ENV=development npm install --include=dev

# ---- builder ----
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
# curl is required by src/lib/ghl.ts — Node fetch/FormData fails against GHL media API
RUN apk add --no-cache openssl curl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV STORAGE_DIR=/app/storage

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
# Copy prisma CLI so `prisma db push` works at runtime (we have no migrations)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin

RUN mkdir -p /app/storage && chown -R nextjs:nodejs /app/storage

USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --accept-data-loss --skip-generate; node server.js"]
