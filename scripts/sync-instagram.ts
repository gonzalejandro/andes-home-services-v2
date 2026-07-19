import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchInstagramMedia, getEnvInstagramToken } from '../src/lib/instagram';

// Run with the token loaded from .env:
//   tsx --env-file=.env scripts/sync-instagram.ts
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/data/instagram.json');

const token = getEnvInstagramToken();
if (!token) {
  throw new Error('INSTAGRAM_ACCESS_TOKEN is not set. Try: tsx --env-file=.env scripts/sync-instagram.ts');
}

const limit = Number(process.env.INSTAGRAM_MEDIA_LIMIT ?? 12);
const feed = await fetchInstagramMedia(token, limit);

await writeFile(outputPath, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');

console.log(`Wrote ${feed.media.length} Instagram items to ${outputPath}`);
