'use client';

import { Category } from '@/types/survey';
import RatingInput from './RatingInput';

interface CategorySectionProps {
  category: Category;
  scores: Record<string, number>;
  comment: string;
  onScoreChange: (questionId: string, score: number) => void;
  onCommentChange: (comment: string) => void;
}

export default function CategorySection({
  category,
  scores,
  comment,
  onScoreChange,
  onCommentChange,
}: CategorySectionProps) {
  // Calculate current total for this category
  const currentTotal = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxTotal = category.questions.reduce((sum, q) => sum + q.maxScore, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="border-b pb-3 mb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900">
            {category.name}
          </h2>
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded">
            {category.weight}% of Total Score
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Current Score: <span className="font-semibold">{currentTotal}</span> / {maxTotal}
        </div>
      </div>

      {category.questions.map((question) => (
        <div key={question.id} className="mb-6">
          <RatingInput
            label={question.question}
            value={scores[question.id] || 0}
            onChange={(value) => onScoreChange(question.id, value)}
            maxScore={question.maxScore}
          />
        </div>
      ))}

      <div className="mt-4 pt-4 border-t">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comments
        </label>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add any additional comments for this category..."
        />
      </div>
    </div>
  );
}
