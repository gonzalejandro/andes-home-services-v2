const GRAPH_API = 'https://graph.instagram.com';

export type InstagramMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export type InstagramMediaItem = {
  id: string;
  caption: string;
  mediaType: InstagramMediaType;
  /** Direct media URL. For VIDEO this is the playable file; expires over time. */
  mediaUrl: string;
  permalink: string;
  /** Poster/preview image for videos. */
  thumbnailUrl?: string;
  timestamp: string;
};

export type InstagramFeed = {
  media: InstagramMediaItem[];
  fetchedAt: string;
};

/**
 * Reads the long-lived access token. Checks process.env (Vercel/CI) first, then
 * import.meta.env (Astro build with a local .env). Returns null when unset so
 * the site degrades gracefully to its static gallery.
 */
export function getEnvInstagramToken(): string | null {
  const fromProcess = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (fromProcess) return fromProcess;
  const fromImportMeta = (import.meta as { env?: Record<string, string | undefined> }).env
    ?.INSTAGRAM_ACCESS_TOKEN;
  return fromImportMeta ?? null;
}

export function isInstagramConfigured(): boolean {
  return getEnvInstagramToken() !== null;
}

type RawMedia = {
  id: string;
  caption?: string;
  media_type: InstagramMediaType;
  media_url?: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
};

/** Fetches the account's most recent media via the Instagram Graph API. */
export async function fetchInstagramMedia(token: string, limit = 12): Promise<InstagramFeed> {
  const fields = 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp';
  const url = `${GRAPH_API}/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Instagram API request failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as { data?: RawMedia[] };
  const media: InstagramMediaItem[] = (payload.data ?? []).map((item) => ({
    id: item.id,
    caption: item.caption?.trim() ?? '',
    mediaType: item.media_type,
    mediaUrl: item.media_url ?? item.thumbnail_url ?? '',
    permalink: item.permalink,
    thumbnailUrl: item.thumbnail_url,
    timestamp: item.timestamp,
  }));

  return { media, fetchedAt: new Date().toISOString() };
}

/**
 * Refreshes a long-lived token, extending it 60 days. Instagram only allows this
 * once the token is >24h old, so failures are expected and non-fatal (returns
 * null — keep using the existing token).
 */
export async function refreshInstagramToken(token: string): Promise<string | null> {
  try {
    const url = `${GRAPH_API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = (await response.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export function getVideos(feed: InstagramFeed): InstagramMediaItem[] {
  return feed.media.filter((item) => item.mediaType === 'VIDEO');
}
