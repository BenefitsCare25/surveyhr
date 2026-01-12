'use client';

import { Category } from '@/types/survey';
import RatingInput from './RatingInput';
import { useEffect } from 'react';

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
  // Calculate overall score from individual question scores (not including overall itself)
  const calculatedOverallScore = category.questions.reduce((sum, q) => {
    return sum + (scores[q.id] || 0);
  }, 0);

  // Calculate dynamic max score based on visible questions
  const maxTotal = category.questions.reduce((sum, q) => {
    return sum + q.maxScore;
  }, 0);

  // Auto-update the overall score whenever individual scores change
  useEffect(() => {
    onScoreChange(category.overallQuestion.id, calculatedOverallScore);
  }, [calculatedOverallScore, category.overallQuestion.id, onScoreChange]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div className="border-b dark:border-gray-700 pb-3 mb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {category.name}
          </h2>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded">
            {category.weight}% of Total Score
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Current Score: <span className="font-semibold">{calculatedOverallScore}</span> / {maxTotal}
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

      {/* Overall Satisfaction - Calculated Display */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">{category.overallQuestion.question}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Automatically calculated from scores above</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {calculatedOverallScore}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Maximum Score: {maxTotal}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Comments
        </label>
        <textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Add any additional comments for this category..."
        />
      </div>
    </div>
  );
}
