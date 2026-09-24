// Gold shield showing the overall rating (the .rating-shield from the mockup).
const SHIELD = '[clip-path:polygon(50%_0%,100%_8%,100%_72%,50%_100%,0%_72%,0%_8%)]';

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);

  return (
    <div
      className="flex justify-center gap-[0.125rem] text-[0.9rem] text-amber-500"
      aria-label={`${rating} out of 5 stars`}
    >
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
    <div className={`bg-[#c9a033] p-[2px] [filter:drop-shadow(0_2px_6px_rgb(92_72_16/0.22))] ${SHIELD}`}>
      <div
        className={`min-w-[6rem] bg-gradient-to-b from-[#fff8e7] to-[#f5e6b8] px-[1.35rem] pb-[0.5rem] pt-[0.7rem] text-center ${SHIELD}`}
      >
        <p className="font-display text-[1.6rem] font-bold leading-none text-brand-900">
          {rating.toFixed(1)}
        </p>
        <div className="mt-[0.25rem]">
          <Stars rating={rating} />
        </div>
      </div>
    </div>
  );
}
