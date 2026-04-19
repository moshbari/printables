/**
 * GoHighLevel media library uploader.
 *
 * Why curl (not fetch): Node's native fetch + FormData, and the `form-data`
 * npm package, both return 400 "Unexpected end of form" against this API.
 * curl via execSync is the verified-working pattern (see claude-playbook
 * GHL_MEDIA_UPLOAD.md).
 *
 * Required env:
 *   GHL_API_KEY       — PIT token, format pit-<uuid>
 *   GHL_LOCATION_ID   — sub-account location id
 *
 * Optional env (one of these, or neither):
 *   GHL_FOLDER_ID     — folder id (the string _id from /medias/files)
 *   GHL_FOLDER_NAME   — folder name; resolved to id at first use, cached
 *
 * If neither is set, files upload to location root.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";

const GHL_API = "https://services.leadconnectorhq.com";

export function isGhlConfigured(): boolean {
  return Boolean(process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID);
}

let cachedFolderId: string | null = null;
let folderLookupFailed = false;

async function resolveFolderId(): Promise<string | null> {
  // Env-provided id takes precedence, no lookup needed
  const envId = process.env.GHL_FOLDER_ID;
  if (envId) return envId;

  const folderName = process.env.GHL_FOLDER_NAME;
  if (!folderName) return null;

  if (cachedFolderId) return cachedFolderId;
  if (folderLookupFailed) return null;

  const locationId = process.env.GHL_LOCATION_ID!;
  const token = process.env.GHL_API_KEY!;

  // Playbook rule: MUST include type=folder or 422 "type must be a string"
  const url =
    `${GHL_API}/medias/files?altId=${encodeURIComponent(locationId)}` +
    `&altType=location&type=folder&sortBy=createdAt&sortOrder=desc&limit=100`;

  const cmd =
    `curl -s -X GET "${url}" ` +
    `-H "Authorization: Bearer ${token}" ` +
    `-H "Version: 2021-07-28"`;

  try {
    const raw = execSync(cmd, { encoding: "utf8", timeout: 30000 });
    const data = JSON.parse(raw);
    const items: any[] = data?.files || data?.folders || data?.items || [];
    // Playbook gotcha: id is in item._id (underscore), item.id is undefined
    const hit = items.find((i) => i?.name === folderName);
    const id = hit?._id || hit?.id;
    if (id) {
      console.log(`[GHL] resolved folder "${folderName}" -> ${id}`);
      cachedFolderId = id;
      return id;
    }
    console.warn(
      `[GHL] folder "${folderName}" not found in ${items.length} folders — uploads will go to root`,
    );
    folderLookupFailed = true;
    return null;
  } catch (e: any) {
    console.error("[GHL] folder lookup failed:", e?.message || e);
    folderLookupFailed = true;
    return null;
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Upload a buffer to GHL media library.
 * Returns the permanent CDN URL, or throws.
 *
 *   const url = await uploadToGhl(zipBuffer, "printable.zip", "application/zip");
 */
export async function uploadToGhl(
  body: Buffer,
  filename: string,
  contentType: string,
): Promise<{ url: string; fileId: string | null }> {
  if (!isGhlConfigured()) {
    throw new Error("GHL not configured (GHL_API_KEY / GHL_LOCATION_ID missing)");
  }

  const token = process.env.GHL_API_KEY!;
  const locationId = process.env.GHL_LOCATION_ID!;

  const safeName = sanitizeFilename(filename);
  const parentId = await resolveFolderId();

  // curl needs a file path — write to tmp, always clean up
  const tmpDir = path.join(os.tmpdir(), "printables-ghl");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const ext = path.extname(safeName) || ".bin";
  const tmpPath = path.join(tmpDir, `${randomUUID()}${ext}`);
  fs.writeFileSync(tmpPath, body);

  try {
    let cmd =
      `curl -s -X POST "${GHL_API}/medias/upload-file" ` +
      `-H "Authorization: Bearer ${token}" ` +
      `-H "Version: 2021-07-28" ` +
      `-F "file=@${tmpPath};type=${contentType}" ` +
      `-F "hosted=false" ` +
      `-F "name=${safeName}" ` +
      `-F "altId=${locationId}" ` +
      `-F "altType=location"`;
    if (parentId) cmd += ` -F "parentId=${parentId}"`;

    console.log(`[GHL] uploading ${safeName} (${body.length} bytes)`);
    const raw = execSync(cmd, { encoding: "utf8", timeout: 120000 });

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error("[GHL] non-JSON response:", raw.substring(0, 500));
      throw new Error(`GHL returned non-JSON response`);
    }

    const url: string | undefined = data?.url;
    const fileId: string | null = data?.fileId || data?._id || data?.id || null;

    if (!url) {
      console.error("[GHL] upload ok but missing url:", JSON.stringify(data).substring(0, 500));
      throw new Error(`GHL upload returned no URL: ${JSON.stringify(data).substring(0, 200)}`);
    }

    console.log(`[GHL] uploaded ${safeName} -> ${url}`);
    return { url, fileId };
  } finally {
    try {
      fs.unlinkSync(tmpPath);
    } catch {
      /* ignore */
    }
  }
}

/**
 * Best-effort upload. Returns null on any failure — caller should fall back
 * to disk storage. Never throws. Never blocks the user.
 */
export async function tryUploadToGhl(
  body: Buffer,
  filename: string,
  contentType: string,
): Promise<string | null> {
  if (!isGhlConfigured()) return null;
  try {
    const { url } = await uploadToGhl(body, filename, contentType);
    return url;
  } catch (e: any) {
    console.error(`[GHL] upload failed for ${filename}:`, e?.message || e);
    return null;
  }
}
