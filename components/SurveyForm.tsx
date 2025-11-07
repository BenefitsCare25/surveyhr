'use client';

import { useState } from 'react';
import { SURVEY_CATEGORIES, SurveyResponse } from '@/types/survey';
import CategorySection from './CategorySection';
import { supabase } from '@/lib/supabase';

export default function SurveyForm() {
  const [companyName, setCompanyName] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [respondentEmail, setRespondentEmail] = useState('');

  // Store scores as: category_id -> question_id -> rating
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  // Store comments as: category_id -> comment
  const [comments, setComments] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScoreChange = (categoryId: string, questionId: string, score: number) => {
    setScores((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [questionId]: score,
      },
    }));
  };

  const handleCommentChange = (categoryId: string, comment: string) => {
    setComments((prev) => ({
      ...prev,
      [categoryId]: comment,
    }));
  };

  const calculateTotalScore = () => {
    let total = 0;
    let maxPossible = 0;

    SURVEY_CATEGORIES.forEach((category) => {
      const categoryScores = scores[category.id] || {};
      // Use the overall satisfaction score for each category
      total += categoryScores[category.overallQuestion.id] || 0;
      maxPossible += category.overallQuestion.maxScore;
    });

    return { total, maxPossible, percentage: (total / maxPossible) * 100 };
  };

  const validateForm = () => {
    if (!companyName.trim()) {
      setErrorMessage('Please enter company name');
      return false;
    }

    // Check if all questions are answered
    for (const category of SURVEY_CATEGORIES) {
      const categoryScores = scores[category.id] || {};
      for (const question of category.questions) {
        if (!categoryScores[question.id] || categoryScores[question.id] === 0) {
          setErrorMessage(`Please answer all questions in ${category.name}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { total, maxPossible, percentage } = calculateTotalScore();

      const response: Omit<SurveyResponse, 'submittedAt'> = {
        companyName,
        respondentName,
        respondentEmail,
        scores,
        comments,
        totalScore: total,
        maxPossibleScore: maxPossible,
        percentageScore: percentage,
      };

      const { error } = await supabase.from('survey_responses').insert([
        {
          company_name: response.companyName,
          respondent_name: response.respondentName,
          respondent_email: response.respondentEmail,
          scores: response.scores,
          comments: response.comments,
          total_score: response.totalScore,
          max_possible_score: response.maxPossibleScore,
          percentage_score: response.percentageScore,
        },
      ]);

      if (error) throw error;

      setSubmitStatus('success');

      // Reset form after successful submission
      setTimeout(() => {
        setCompanyName('');
        setRespondentName('');
        setRespondentEmail('');
        setScores({});
        setComments({});
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const { total, maxPossible, percentage } = calculateTotalScore();

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Broker&apos;s Service Level Assessment
        </h1>
        <p className="text-blue-100">
          Quarterly evaluation form for rating broker service performance
        </p>
      </div>

      {/* Respondent Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Respondent Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter company name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={respondentName}
              onChange={(e) => setRespondentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <input
              type="email"
              value={respondentEmail}
              onChange={(e) => setRespondentEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@company.com"
            />
          </div>
        </div>
      </div>

      {/* Survey Categories */}
      {SURVEY_CATEGORIES.map((category) => (
        <CategorySection
          key={category.id}
          category={category}
          scores={scores[category.id] || {}}
          comment={comments[category.id] || ''}
          onScoreChange={(questionId, score) =>
            handleScoreChange(category.id, questionId, score)
          }
          onCommentChange={(comment) => handleCommentChange(category.id, comment)}
        />
      ))}

      {/* Score Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Score Summary</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Current Score</p>
            <p className="text-3xl font-bold text-blue-600">{total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Maximum Score</p>
            <p className="text-3xl font-bold text-gray-700">{maxPossible}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Percentage</p>
            <p className="text-3xl font-bold text-green-600">
              {percentage.toFixed(1)}%
            </p>
          </div>
        </div>
        {percentage >= 80 && (
          <p className="text-center mt-4 text-green-700 font-medium">
            ✓ Overall satisfaction target (80%) achieved!
          </p>
        )}
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border-2 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">✓ Survey submitted successfully!</p>
          <p className="text-sm">Thank you for your feedback.</p>
        </div>
      )}

      {submitStatus === 'error' && errorMessage && (
        <div className="bg-red-50 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">✗ {errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg shadow-lg
            transition-all transform hover:scale-105
            ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Survey'}
        </button>
      </div>
    </form>
  );
}
