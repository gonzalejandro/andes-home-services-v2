import { scraper } from 'google-maps-review-scraper';
import { sortReviewsPayload, type GoogleReview, type GoogleReviewsPayload } from './reviews';
import { DEFAULT_MAPS_URL } from './reviews-config';

function stripHtml(value: string | undefined | null): string {
  if (!value || typeof value !== 'string') return '';
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

function parsePublishedAt(time: unknown): string | undefined {
  // The raw time node looks like ["8 hours ago", 2, "1784655655163"], where the
  // last element is the publish time in epoch milliseconds. Prefer that absolute
  // value so the relative label can be recomputed at render time.
  if (!Array.isArray(time)) return undefined;

  const raw = time[2];
  const ms = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN;
  if (!Number.isFinite(ms) || ms <= 0) return undefined;

  return new Date(ms).toISOString();
}

function mapRawReview(review: unknown): GoogleReview | null {
  if (!Array.isArray(review)) return null;

  const rating = typeof review[1] === 'number' ? review[1] : 0;
  const publishedAt = parsePublishedAt(review[2]);
  const relativePublishTimeDescription =
    Array.isArray(review[2]) && typeof review[2][0] === 'string' ? review[2][0] : undefined;
  const author = Array.isArray(review[3]) ? review[3] : [];
  const text = stripHtml((review[27] ?? review[28]) as string | undefined);

  return {
    authorName: typeof author[0] === 'string' ? author[0] : 'Google user',
    authorUri: typeof author[2] === 'string' ? author[2] : undefined,
    authorPhotoUri: typeof author[1] === 'string' ? author[1] : undefined,
    rating,
    text,
    publishedAt,
    // Kept only as a fallback for reviews whose absolute timestamp is missing.
    relativePublishTimeDescription,
  };
}

export async function scrapeGoogleReviews(): Promise<GoogleReviewsPayload> {
  const mapsUrl = process.env.GOOGLE_MAPS_REVIEWS_URL ?? DEFAULT_MAPS_URL;
  const pages = process.env.SCRAPE_REVIEW_PAGES ?? 'max';

  const scraped = await scraper(mapsUrl, {
    sort_type: 'newest',
    pages,
    clean: false,
    experimental: true,
  });

  if (!Array.isArray(scraped) || scraped.length === 0) {
    throw new Error('No reviews returned from Google Maps.');
  }

  const reviews = scraped.map(mapRawReview).filter((review): review is GoogleReview => review !== null);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : null;

  return sortReviewsPayload({
    rating: averageRating,
    userRatingCount: reviews.length,
    reviews,
    fetchedAt: new Date().toISOString(),
    sourceUrl: mapsUrl,
  });
}
