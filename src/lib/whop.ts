import crypto from "crypto";

export const WHOP_CHECKOUT_URL =
  process.env.WHOP_CHECKOUT_URL ||
  "https://whop.com/zpresso-llc/printables-etsy-ready-printables-in-60-seconds/";

export const WHOP_API_KEY = process.env.WHOP_API_KEY || "";
export const WHOP_WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET || "";
export const WHOP_PRODUCT_ID = process.env.WHOP_PRODUCT_ID || "";

/**
 * Build a Whop checkout URL that tracks our user so the webhook can
 * match the purchase back to the right account.
 *
 * Whop forwards `metadata[...]` query params straight onto the membership,
 * and we can read them back on the `membership.went_valid` webhook.
 */
export function buildCheckoutUrl(opts: { userId: string; email?: string }) {
  const url = new URL(WHOP_CHECKOUT_URL);
  url.searchParams.set("metadata[userId]", opts.userId);
  if (opts.email) url.searchParams.set("email", opts.email);
  return url.toString();
}

/**
 * Verify a webhook signature from Whop.
 * Whop signs payloads with HMAC-SHA256 and sends the hex digest in the
 * `x-whop-signature` header (format: `sha256=<hex>` or just `<hex>`).
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!WHOP_WEBHOOK_SECRET) {
    console.warn("[whop] WHOP_WEBHOOK_SECRET missing — refusing webhook");
    return false;
  }
  if (!signature) return false;
  const provided = signature.startsWith("sha256=") ? signature.slice(7) : signature;
  const expected = crypto
    .createHmac("sha256", WHOP_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(provided, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/**
 * Fetch a membership from Whop by ID — used on OAuth callback so we can
 * verify a returning user is actually paid, without trusting the URL.
 */
export async function fetchMembership(membershipId: string) {
  const res = await fetch(`https://api.whop.com/api/v5/memberships/${membershipId}`, {
    headers: { Authorization: `Bearer ${WHOP_API_KEY}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export function membershipIsActive(m: any): boolean {
  if (!m) return false;
  // Whop uses status values like "active", "trialing", "past_due", "canceled", "expired"
  const status = String(m.status || "").toLowerCase();
  return status === "active" || status === "trialing" || m.valid === true;
}
