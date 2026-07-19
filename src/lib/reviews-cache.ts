import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { list, put } from '@vercel/blob';
import seedReviews from '../data/google-reviews.json';
import { sortReviewsPayload, type GoogleReviewsPayload } from './reviews';
import { REVIEWS_BLOB_PATH, REVIEWS_MAX_AGE_MS } from './reviews-config';
import { scrapeGoogleReviews } from './scrape-google-reviews';

const localReviewsPath = path.join(process.cwd(), 'src/data/google-reviews.json');

function isStale(fetchedAt: string): boolean {
  const fetchedTime = Date.parse(fetchedAt);
  if (Number.isNaN(fetchedTime)) return true;
  return Date.now() - fetchedTime > REVIEWS_MAX_AGE_MS;
}

async function readFromBlob(): Promise<GoogleReviewsPayload | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;

  try {
    const { blobs } = await list({ prefix: REVIEWS_BLOB_PATH, limit: 1 });
    const blob = blobs.find((entry) => entry.pathname === REVIEWS_BLOB_PATH);
    if (!blob) return null;

    const response = await fetch(blob.url);
    if (!response.ok) return null;

    return (await response.json()) as GoogleReviewsPayload;
  } catch {
    return null;
  }
}

async function writeToBlob(payload: GoogleReviewsPayload): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;

  await put(REVIEWS_BLOB_PATH, JSON.stringify(payload), {
    access: 'public',
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

async function readFromLocalFile(): Promise<GoogleReviewsPayload | null> {
  try {
    const raw = await readFile(localReviewsPath, 'utf8');
    return JSON.parse(raw) as GoogleReviewsPayload;
  } catch {
    return null;
  }
}

async function writeToLocalFile(payload: GoogleReviewsPayload): Promise<void> {
  await writeFile(localReviewsPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function getStoredReviews(): Promise<GoogleReviewsPayload> {
  return (await readFromBlob()) ?? (await readFromLocalFile()) ?? (seedReviews as GoogleReviewsPayload);
}

async function saveReviews(payload: GoogleReviewsPayload): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeToBlob(payload);
    return;
  }

  if (import.meta.env.DEV) {
    await writeToLocalFile(payload);
  }
}

export async function getReviewsWithRefresh(): Promise<GoogleReviewsPayload> {
  const stored = sortReviewsPayload(await getStoredReviews());

  if (!isStale(stored.fetchedAt)) {
    return stored;
  }

  try {
    const fresh = await scrapeGoogleReviews();
    await saveReviews(fresh);
    return fresh;
  } catch (error) {
    console.error('Failed to refresh Google reviews:', error);
    return stored;
  }
}
