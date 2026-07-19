import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { list, put } from '@vercel/blob';
import seedFeed from '../data/instagram.json';
import {
  fetchInstagramMedia,
  getEnvInstagramToken,
  isInstagramConfigured,
  refreshInstagramToken,
  type InstagramFeed,
} from './instagram';

const FEED_BLOB_PATH = 'instagram-feed.json';
const TOKEN_BLOB_PATH = 'instagram/token.json';
const localFeedPath = path.join(process.cwd(), 'src/data/instagram.json');

const MAX_AGE_DAYS = Number(process.env.INSTAGRAM_MAX_AGE_DAYS ?? 1);
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
const MEDIA_LIMIT = Number(process.env.INSTAGRAM_MEDIA_LIMIT ?? 12);

type StoredToken = { access_token: string; updated_at: string };

function isStale(fetchedAt: string): boolean {
  const fetchedTime = Date.parse(fetchedAt);
  if (Number.isNaN(fetchedTime)) return true;
  return Date.now() - fetchedTime > MAX_AGE_MS;
}

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    const blob = blobs.find((entry) => entry.pathname === pathname);
    if (!blob) return null;
    const response = await fetch(blob.url);
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function writeBlobJson(pathname: string, value: unknown): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  await put(pathname, JSON.stringify(value), {
    access: 'public',
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

async function readFeedFromLocalFile(): Promise<InstagramFeed | null> {
  try {
    const raw = await readFile(localFeedPath, 'utf8');
    return JSON.parse(raw) as InstagramFeed;
  } catch {
    return null;
  }
}

async function getStoredFeed(): Promise<InstagramFeed> {
  return (
    (await readBlobJson<InstagramFeed>(FEED_BLOB_PATH)) ??
    (await readFeedFromLocalFile()) ??
    (seedFeed as InstagramFeed)
  );
}

async function saveFeed(feed: InstagramFeed): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeBlobJson(FEED_BLOB_PATH, feed);
    return;
  }
  if (import.meta.env.DEV) {
    await writeFile(localFeedPath, `${JSON.stringify(feed, null, 2)}\n`, 'utf8');
  }
}

/** Prefer a refreshed token stored in Blob, falling back to the env token. */
async function getActiveToken(): Promise<string | null> {
  const stored = await readBlobJson<StoredToken>(TOKEN_BLOB_PATH);
  return stored?.access_token ?? getEnvInstagramToken();
}

/**
 * Best-effort token refresh so the 60-day token stays alive as long as the site
 * rebuilds periodically. Never throws — a failed refresh just keeps the old token.
 */
async function maybeRefreshToken(token: string): Promise<void> {
  const refreshed = await refreshInstagramToken(token);
  if (refreshed && refreshed !== token) {
    await writeBlobJson(TOKEN_BLOB_PATH, {
      access_token: refreshed,
      updated_at: new Date().toISOString(),
    } satisfies StoredToken);
  }
}

/**
 * Returns the cached Instagram feed, refreshing from the Graph API when the
 * cache is stale and a token is configured. Falls back to the last good cache
 * (or the empty seed) on any failure so the build never breaks.
 */
export async function getInstagramFeedWithRefresh(): Promise<InstagramFeed> {
  const stored = await getStoredFeed();

  if (!isInstagramConfigured() || !isStale(stored.fetchedAt)) {
    return stored;
  }

  try {
    const token = await getActiveToken();
    if (!token) return stored;

    const fresh = await fetchInstagramMedia(token, MEDIA_LIMIT);
    await saveFeed(fresh);
    await maybeRefreshToken(token);
    return fresh;
  } catch (error) {
    console.error('Failed to refresh Instagram feed:', error);
    return stored;
  }
}
