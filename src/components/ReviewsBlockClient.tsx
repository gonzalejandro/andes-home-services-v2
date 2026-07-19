import { useEffect, useRef, useState } from 'react';
import type { GoogleReviewsPayload } from '@/lib/reviews';
import { ReviewsRatingBadge } from './ReviewsRatingBadge';
import { ReviewsSection } from './ReviewsSection';

interface Props {
  initialData: GoogleReviewsPayload;
  showHeading?: boolean;
  subtitle?: string;
}

export function ReviewsBlockClient({
  initialData,
  showHeading = true,
  subtitle = 'See what our customers are saying about our stump grinding services.',
}: Props) {
  const [data, setData] = useState(initialData);
  const headingRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  // Reveal-on-scroll managed in React so re-renders (e.g. after a reviews
  // refresh) can't wipe an imperatively-added class. The `.reveal` styles only
  // apply on pages that set the `reveal-ready` root class (the homepage).
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function refreshReviews() {
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) return;

        const next = (await response.json()) as GoogleReviewsPayload;
        if (!cancelled && next.fetchedAt !== initialData.fetchedAt) {
          setData(next);
        }
      } catch {
        // Keep the build-time reviews if the refresh request fails.
      }
    }

    void refreshReviews();

    return () => {
      cancelled = true;
    };
  }, [initialData.fetchedAt]);

  if (data.reviews.length === 0) {
    return (
      <p className="text-center text-brand-900/75">
        No reviews yet. They will appear here after the first successful refresh.
      </p>
    );
  }

  return (
    <div>
      {showHeading && (
        <div
          ref={headingRef}
          data-reveal-self
          className={`reveal mb-10 text-center${revealed ? ' is-visible' : ''}`}
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            <h2 className="text-3xl font-bold text-brand-800 md:text-4xl">Google Reviews</h2>
            {data.rating !== null && <ReviewsRatingBadge rating={data.rating} />}
          </div>
          {subtitle && <p className="mx-auto mt-3 max-w-3xl text-lg text-brand-900/75">{subtitle}</p>}
        </div>
      )}

      <ReviewsSection reviews={data.reviews} />
    </div>
  );
}
