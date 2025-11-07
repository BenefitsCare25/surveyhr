'use client';

import { useState } from 'react';
import { SURVEY_CATEGORIES, Category, QuestionVisibility } from '@/types/survey';

interface QuestionToggleTreeProps {
  visibility: QuestionVisibility[];
  onChange: (visibility: QuestionVisibility[]) => void;
  configId: string;
  configType: 'template' | 'instance';
}

export default function QuestionToggleTree({
  visibility,
  onChange,
  configId,
  configType,
}: QuestionToggleTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(SURVEY_CATEGORIES.map(c => c.id))
  );

  // Helper to check if category is visible
  const isCategoryVisible = (categoryId: string): boolean => {
    const categoryVis = visibility.find(
      v => v.category_id === categoryId && v.question_id === null
    );
    return categoryVis?.is_visible ?? true;
  };

  // Helper to check if question is visible
  const isQuestionVisible = (categoryId: string, questionId: string): boolean => {
    const questionVis = visibility.find(
      v => v.category_id === categoryId && v.question_id === questionId
    );
    return questionVis?.is_visible ?? true;
  };

  // Toggle category visibility
  const toggleCategory = (categoryId: string) => {
    const currentlyVisible = isCategoryVisible(categoryId);
    const newVisibility = [...visibility];

    // Remove existing category-level record
    const filtered = newVisibility.filter(
      v => !(v.category_id === categoryId && v.question_id === null)
    );

    // Add new category-level record
    filtered.push({
      id: '',
      config_id: configId,
      config_type: configType,
      category_id: categoryId,
      question_id: null,
      is_visible: !currentlyVisible,
      created_at: new Date().toISOString(),
    });

    // If hiding category, hide all questions too
    if (currentlyVisible) {
      const category = SURVEY_CATEGORIES.find(c => c.id === categoryId);
      if (category) {
        category.questions.forEach(q => {
          const questionIndex = filtered.findIndex(
            v => v.category_id === categoryId && v.question_id === q.id
          );
          if (questionIndex >= 0) {
            filtered[questionIndex].is_visible = false;
          } else {
            filtered.push({
              id: '',
              config_id: configId,
              config_type: configType,
              category_id: categoryId,
              question_id: q.id,
              is_visible: false,
              created_at: new Date().toISOString(),
            });
          }
        });
      }
    }

    onChange(filtered);
  };

  // Toggle question visibility
  const toggleQuestion = (categoryId: string, questionId: string) => {
    const currentlyVisible = isQuestionVisible(categoryId, questionId);
    const newVisibility = [...visibility];

    // Remove existing question record
    const filtered = newVisibility.filter(
      v => !(v.category_id === categoryId && v.question_id === questionId)
    );

    // Add new question record
    filtered.push({
      id: '',
      config_id: configId,
      config_type: configType,
      category_id: categoryId,
      question_id: questionId,
      is_visible: !currentlyVisible,
      created_at: new Date().toISOString(),
    });

    onChange(filtered);
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 mb-4">
        Toggle categories or individual questions to customize the survey
      </div>

      {SURVEY_CATEGORIES.map((category: Category) => {
        const catVisible = isCategoryVisible(category.id);
        const isExpanded = expandedCategories.has(category.id);

        return (
          <div key={category.id} className="border rounded-lg overflow-hidden">
            {/* Category Header */}
            <div className="bg-gray-50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`flex items-center gap-2 flex-1 text-left transition-opacity ${!catVisible ? 'opacity-50' : ''}`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${catVisible ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                    {catVisible && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.weight}% of total score</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Questions List */}
            {isExpanded && (
              <div className="bg-white">
                {category.questions.map((question) => {
                  const qVisible = isQuestionVisible(category.id, question.id);

                  return (
                    <button
                      key={question.id}
                      onClick={() => toggleQuestion(category.id, question.id)}
                      disabled={!catVisible}
                      className={`w-full p-3 pl-12 flex items-start gap-3 hover:bg-gray-50 border-t text-left transition-opacity ${!catVisible || !qVisible ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-4 h-4 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${qVisible && catVisible ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {qVisible && catVisible && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        {question.question}
                        <span className="text-xs text-gray-500 ml-2">
                          (max: {question.maxScore} points)
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
