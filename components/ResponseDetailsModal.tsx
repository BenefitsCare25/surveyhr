'use client';

import { SURVEY_CATEGORIES } from '@/types/survey';

interface SurveyResponse {
  id: string;
  company_name: string;
  respondent_name: string;
  respondent_email: string;
  submitted_at: string;
  scores: Record<string, Record<string, number>>;
  comments: Record<string, string>;
  total_score: number;
  max_possible_score: number;
  percentage_score: number;
}

interface ResponseDetailsModalProps {
  response: SurveyResponse | null;
  onClose: () => void;
}

export default function ResponseDetailsModal({ response, onClose }: ResponseDetailsModalProps) {
  if (!response) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingLabel = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Survey Response Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Metadata Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Company:</span>
                <span className="ml-2 text-gray-900">{response.company_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Respondent:</span>
                <span className="ml-2 text-gray-900">{response.respondent_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{response.respondent_email}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <span className="ml-2 text-gray-900">{formatDate(response.submitted_at)}</span>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">
                {response.percentage_score.toFixed(2)}%
              </span>
              <span className="text-sm text-gray-600">
                ({response.total_score} / {response.max_possible_score} points)
              </span>
              <span
                className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                  response.percentage_score >= 90
                    ? 'bg-green-100 text-green-800'
                    : response.percentage_score >= 70
                    ? 'bg-blue-100 text-blue-800'
                    : response.percentage_score >= 50
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {getRatingLabel(response.percentage_score)}
              </span>
            </div>
          </div>

          {/* Category Scores */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Scores</h3>
            {SURVEY_CATEGORIES.map((category) => {
              const categoryScores = response.scores?.[category.id] || {};
              const categoryComment = response.comments?.[category.id] || '';
              const categoryTotal = categoryScores.overall || 0;
              const maxCategoryScore = category.overallQuestion.maxScore;
              const categoryPercentage = maxCategoryScore > 0 ? (categoryTotal / maxCategoryScore) * 100 : 0;

              return (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">Weight: {category.weight}%</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {categoryTotal} / {maxCategoryScore}
                      </div>
                      <div className="text-sm text-gray-600">{categoryPercentage.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Individual Questions */}
                  <div className="space-y-2 mb-3">
                    {category.questions.map((question) => {
                      const score = categoryScores[question.id] || 0;
                      return (
                        <div key={question.id} className="flex justify-between items-start text-sm">
                          <span className="text-gray-700 flex-1">{question.question}</span>
                          <span className="font-medium text-gray-900 ml-4">
                            {score} / {question.maxScore}
                          </span>
                        </div>
                      );
                    })}

                    {/* Overall Satisfaction Score */}
                    <div className="flex justify-between items-start text-sm pt-2 mt-2 border-t border-gray-300 bg-blue-50 -mx-3 px-3 py-2 rounded">
                      <span className="text-gray-900 font-semibold flex-1">{category.overallQuestion.question}</span>
                      <span className="font-bold text-blue-600 ml-4">
                        {categoryTotal} / {maxCategoryScore}
                      </span>
                    </div>
                  </div>

                  {/* Comments */}
                  {categoryComment && (
                    <div className="bg-gray-50 rounded p-3 mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Comments:</p>
                      <p className="text-sm text-gray-900">{categoryComment}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
