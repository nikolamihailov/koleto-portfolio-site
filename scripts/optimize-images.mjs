// Converts original screenshots in images-src/ into responsive WebP files in public/.
//
//   images-src/projects/<project>/<name>.(png|jpg|jpeg|webp)
//     → public/images/projects/<project>/<name>-480.webp   (thumbnails, small cards)
//     → public/images/projects/<project>/<name>-720.webp   (cards on phones, ~1.75–2x DPR)
//     → public/images/projects/<project>/<name>-960.webp   (cards on retina, mobile gallery)
//     → public/images/projects/<project>/<name>-1600.webp  (desktop gallery)
//
// Reference images in src/data/projects.ts WITHOUT size/extension:
//   '/images/projects/<project>/<name>'
//
// Run with: npm run images   (only re-processes files whose originals changed)

import { mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Keep in sync with IMAGE_WIDTHS in src/utils/images.ts
const WIDTHS = [480, 720, 960, 1600];
const QUALITY = 80;
const EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'images-src');
const OUT = join(root, 'public', 'images');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (EXTS.has(extname(entry.name).toLowerCase())) yield p;
  }
}

const mtime = (p) => stat(p).then((s) => s.mtimeMs).catch(() => 0);

let made = 0;
let skipped = 0;
for await (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  const base = join(OUT, rel.slice(0, -extname(rel).length));
  await mkdir(dirname(base), { recursive: true });
  const srcTime = await mtime(file);

  for (const w of WIDTHS) {
    const out = `${base}-${w}.webp`;
    if ((await mtime(out)) >= srcTime) {
      skipped++;
      continue;
    }
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
    made++;
  }
  console.log(`✓ ${rel.replaceAll('\\', '/')}`);
}
console.log(`\n${made} images written, ${skipped} up to date.`);
