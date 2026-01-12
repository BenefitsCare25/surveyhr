'use client';

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxScore: number;
  label: string;
}

export default function RatingInput({ value, onChange, maxScore, label }: RatingInputProps) {
  const isOverall = maxScore > 5;
  const ratingScale = isOverall ? [10, 15, 20, 25, 30] : [1, 2, 3, 4, 5];
  const displayScale = isOverall ?
    ratingScale.filter(r => r <= maxScore) :
    ratingScale;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {displayScale.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`
              px-4 py-2 rounded-md font-medium transition-all
              ${value === rating
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            {rating}
          </button>
        ))}
      </div>
      {!isOverall && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          1 = Very Poor, 5 = Excellent
        </p>
      )}
      {isOverall && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Maximum Score: {maxScore}
        </p>
      )}
    </div>
  );
}
