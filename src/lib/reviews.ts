export type GoogleReview = {
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
  rating: number;
  text: string;
  /** ISO 8601 timestamp of when the review was published. */
  publishedAt?: string;
  /**
   * Legacy relative string (e.g. "8 hours ago") kept for reviews scraped before
   * `publishedAt` existed. Prefer computing the relative time from `publishedAt`.
   */
  relativePublishTimeDescription?: string;
};

export type GoogleReviewsPayload = {
  rating: number | null;
  userRatingCount: number | null;
  reviews: GoogleReview[];
  fetchedAt: string;
  sourceUrl: string;
};

const RELATIVE_UNITS: Array<{ unit: string; ms: number }> = [
  { unit: 'year', ms: 365 * 24 * 60 * 60 * 1000 },
  { unit: 'month', ms: 30 * 24 * 60 * 60 * 1000 },
  { unit: 'week', ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: 'day', ms: 24 * 60 * 60 * 1000 },
  { unit: 'hour', ms: 60 * 60 * 1000 },
  { unit: 'minute', ms: 60 * 1000 },
];

/**
 * Formats how long ago a review was published, in Google's relative style
 * (e.g. "8 hours ago", "6 days ago", "a month ago"), computed fresh from the
 * absolute `publishedAt` timestamp so it never goes stale between scrapes.
 */
export function formatRelativePublishTime(
  review: Pick<GoogleReview, 'publishedAt' | 'relativePublishTimeDescription'>,
  now: number = Date.now(),
): string {
  if (!review.publishedAt) {
    return review.relativePublishTimeDescription ?? '';
  }

  const published = Date.parse(review.publishedAt);
  if (Number.isNaN(published)) {
    return review.relativePublishTimeDescription ?? '';
  }

  const diff = Math.max(0, now - published);

  for (const { unit, ms } of RELATIVE_UNITS) {
    const value = Math.floor(diff / ms);
    if (value >= 1) {
      if (value === 1) {
        return `${unit === 'hour' ? 'an' : 'a'} ${unit} ago`;
      }
      return `${value} ${unit}s ago`;
    }
  }

  return 'just now';
}

export function hasReviewText(review: GoogleReview): boolean {
  return review.text.trim().length > 0;
}

export function sortReviewsWithTextFirst(reviews: GoogleReview[]): GoogleReview[] {
  return [...reviews].sort((a, b) => {
    const aHasText = hasReviewText(a);
    const bHasText = hasReviewText(b);
    if (aHasText === bHasText) return 0;
    return aHasText ? -1 : 1;
  });
}

export function sortReviewsPayload(payload: GoogleReviewsPayload): GoogleReviewsPayload {
  return {
    ...payload,
    reviews: sortReviewsWithTextFirst(payload.reviews),
  };
}
