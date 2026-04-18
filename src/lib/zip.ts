import archiver from "archiver";
import { PassThrough } from "node:stream";

export type ZipEntry = { name: string; content: Buffer | string };

export async function buildZip(entries: ZipEntry[]): Promise<Buffer> {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const pass = new PassThrough();
  const chunks: Buffer[] = [];
  pass.on("data", (c) => chunks.push(c));

  const done = new Promise<Buffer>((resolve, reject) => {
    pass.on("end", () => resolve(Buffer.concat(chunks)));
    pass.on("error", reject);
    archive.on("error", reject);
  });

  archive.pipe(pass);
  for (const e of entries) archive.append(e.content, { name: e.name });
  await archive.finalize();
  return await done;
}
