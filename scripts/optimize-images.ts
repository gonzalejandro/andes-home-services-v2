/**
 * Build-time image optimizer.
 *
 * Downscales and re-compresses oversized raster images in place so we never
 * ship multi-megabyte originals. Astro's <Image>/getImage pipeline optimizes
 * on top of these, and any raw files in public/ ship small too.
 *
 * Idempotent: files already within MAX_WIDTH are skipped, so committing the
 * optimized results makes subsequent runs (including every Vercel build) no-ops.
 *
 * Run manually with `npm run optimize:images`; runs automatically before build.
 */
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Directories whose raster images should be capped/compressed in place.
const DIRS = ['src/assets', 'public'];

// Never upscale; only shrink images wider than this. 2000px covers full-bleed
// hero backgrounds on retina displays with room to spare.
const MAX_WIDTH = 2000;
const QUALITY = 80;

const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function human(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

async function optimize(file: string): Promise<void> {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER.has(ext)) return;

  const before = (await stat(file)).size;
  const meta = await sharp(file, { failOn: 'none' }).metadata();
  const width = meta.width ?? 0;

  // Already within budget — leave it untouched (keeps the step idempotent).
  if (width <= MAX_WIDTH) return;

  let pipeline = sharp(file, { failOn: 'none' }).resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
  });

  if (ext === '.png') {
    pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9, palette: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: QUALITY });
  } else {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
  }

  // sharp cannot read and write the same path in one pass — go via a temp file.
  const tmp = `${file}.tmp`;
  await pipeline.toFile(tmp);
  const after = (await stat(tmp)).size;
  await rename(tmp, file);

  const rel = path.relative(root, file);
  console.log(
    `  ${rel}: ${width}px → ${MAX_WIDTH}px, ${human(before)} → ${human(after)} ` +
      `(-${Math.round((1 - after / before) * 100)}%)`,
  );
}

async function walk(dir: string): Promise<void> {
  const abs = path.resolve(root, dir);
  let entries: string[];
  try {
    entries = await readdir(abs);
  } catch {
    return; // directory doesn't exist — skip
  }
  for (const name of entries) {
    const full = path.join(abs, name);
    const s = await stat(full);
    if (s.isDirectory()) await walk(path.relative(root, full));
    else await optimize(full);
  }
}

console.log('Optimizing oversized images…');
for (const dir of DIRS) await walk(dir);
console.log('Image optimization complete.');
