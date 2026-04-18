import fs from "node:fs";
import path from "node:path";

export const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), "storage");

export function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

export function genDir(id: string) {
  const dir = path.join(STORAGE_DIR, id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function writeFileSafe(p: string, data: Buffer | string) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, data);
}
