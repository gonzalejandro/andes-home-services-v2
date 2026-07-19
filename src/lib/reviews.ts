export type GoogleReview = {
  authorName: string;
  authorUri?: string;
  authorPhotoUri?: string;
  rating: number;
  text: string;
  relativePublishTimeDescription: string;
};

export type GoogleReviewsPayload = {
  rating: number | null;
  userRatingCount: number | null;
  reviews: GoogleReview[];
  fetchedAt: string;
  sourceUrl: string;
};

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
