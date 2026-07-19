function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex justify-center gap-0.5 text-sm text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} aria-hidden="true">
          {index < rounded ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

export function ReviewsRatingBadge({ rating }: { rating: number }) {
  return (
    <div className="rating-shield-border">
      <div className="rating-shield">
        <p className="rating-score text-2xl font-bold leading-none md:text-3xl">{rating.toFixed(1)}</p>
        <div className="stars-row mt-1">
          <Stars rating={rating} />
        </div>
      </div>
    </div>
  );
}
