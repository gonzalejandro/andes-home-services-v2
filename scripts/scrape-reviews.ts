import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scrapeGoogleReviews } from '../src/lib/scrape-google-reviews';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '../src/data/google-reviews.json');

const payload = await scrapeGoogleReviews();

await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log(`Wrote ${payload.reviews.length} reviews to ${outputPath}`);
