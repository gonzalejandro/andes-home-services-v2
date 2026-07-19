import { useCallback, useEffect, useRef, useState } from 'react';
import type { GoogleReview } from '@/lib/reviews';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < rating ? '★' : '☆'}</span>
      ))}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {direction === 'left' ? (
        <path
          fillRule="evenodd"
          d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

function AuthorAvatar({ name, photoUri }: { name: string; photoUri?: string }) {
  const [failed, setFailed] = useState(false);

  if (!photoUri || failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-800">
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={photoUri}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-full object-cover"
    />
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const [expanded, setExpanded] = useState(false);

  const hasText = Boolean(review.text);
  const showToggle = hasText && (review.text?.length ?? 0) > 100;

  return (
    <article
      className={
        expanded
          ? 'card flex max-h-96 w-[min(100%,22rem)] shrink-0 snap-start flex-col overflow-y-auto sm:w-80'
          : 'card flex min-h-64 w-[min(100%,22rem)] shrink-0 snap-start flex-col sm:w-80'
      }
    >
      <div className="flex shrink-0 items-center gap-3">
        <AuthorAvatar name={review.authorName} photoUri={review.authorPhotoUri} />
        <div className="min-w-0">
          {review.authorUri ? (
            <a
              href={review.authorUri}
              className="block truncate font-semibold text-brand-800 hover:text-accent"
              target="_blank"
              rel="noopener noreferrer"
            >
              {review.authorName}
            </a>
          ) : (
            <p className="truncate font-semibold text-brand-800">{review.authorName}</p>
          )}
          <p className="text-xs text-brand-900/60">{review.relativePublishTimeDescription}</p>
        </div>
      </div>
      <div className="mt-2 shrink-0">
        <Stars rating={review.rating} />
      </div>
      {hasText && (
        <div className="mt-2 shrink-0">
          {expanded ? (
            <p className="whitespace-pre-line text-sm text-brand-900/75 [overflow-wrap:anywhere]">
              {review.text}
            </p>
          ) : (
            <p className="line-clamp-4 text-sm text-brand-900/75 [overflow-wrap:anywhere]">
              {review.text}
            </p>
          )}
          {showToggle && (
            <button
              type="button"
              onClick={() => setExpanded((current) => !current)}
              aria-expanded={expanded}
              className="mt-2 block text-xs font-semibold text-accent hover:text-accent-dark"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}
      <p className="mt-5 shrink-0 text-xs text-brand-900/50">Posted on Google</p>
    </article>
  );
}

const AUTO_SCROLL_INTERVAL_MS = 4000;
const TOUCH_RESUME_DELAY_MS = 6000;

function ReviewsCarousel({ reviews }: { reviews: GoogleReview[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const stepAmount = useCallback((el: HTMLDivElement) => {
    const card = el.querySelector('article');
    const gap = 24;
    return card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.9;
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [reviews, updateScrollState]);

  // Auto-advance one card at a time; loop back to the start at the end.
  // Disabled for reduced-motion users and paused on hover/focus/touch/hidden tab.
  useEffect(() => {
    if (reviews.length <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      const el = scrollerRef.current;
      if (!el || pausedRef.current || document.hidden) return;

      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + stepAmount(el),
        behavior: 'smooth',
      });
    }, AUTO_SCROLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [reviews, stepAmount]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const pause = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    pausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  // Touch devices have no hover; resume after a quiet period instead.
  const pauseThenResume = useCallback(() => {
    pause();
    resumeTimeoutRef.current = setTimeout(resume, TOUCH_RESUME_DELAY_MS);
  }, [pause, resume]);

  function scroll(direction: 'left' | 'right') {
    const el = scrollerRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === 'left' ? -stepAmount(el) : stepAmount(el),
      behavior: 'smooth',
    });
  }

  return (
    <div
      className="flex items-center gap-3 sm:gap-4"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      onTouchStart={pauseThenResume}
    >
      <button
        type="button"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous reviews"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-800 bg-white text-brand-800 shadow-sm transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-brand-200 disabled:text-brand-200"
      >
        <ChevronIcon direction="left" />
      </button>

      <div
        ref={scrollerRef}
        className="flex min-w-0 flex-1 items-start gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, index) => (
          <ReviewCard key={`${review.authorName}-${index}`} review={review} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next reviews"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-800 bg-white text-brand-800 shadow-sm transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-brand-200 disabled:text-brand-200"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  );
}

export function ReviewsSection({ reviews }: { reviews: GoogleReview[] }) {
  return <ReviewsCarousel reviews={reviews} />;
}
