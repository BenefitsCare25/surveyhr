'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SURVEY_CATEGORIES } from '@/types/survey';

interface SurveyData {
  id: string;
  company_name: string;
  respondent_name: string;
  respondent_email: string;
  quarter: string | null;
  policy_year: string | null;
  submitted_at: string;
  scores: Record<string, Record<string, number>>;
  comments: Record<string, string>;
  total_score: number;
  max_possible_score: number;
  percentage_score: number;
}

export default function AdminPage() {
  const [responses, setResponses] = useState<SurveyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyData | null>(null);
  const [filterCompany, setFilterCompany] = useState('');

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      setResponses(data || []);
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError('Failed to load survey responses');
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = responses.filter((r) =>
    filterCompany === '' || r.company_name.toLowerCase().includes(filterCompany.toLowerCase())
  );

  const uniqueCompanies = Array.from(new Set(responses.map((r) => r.company_name)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">Loading responses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-500 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Survey Responses Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Total Responses: {responses.length}
              </p>
            </div>
            <a
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              ← Back to Survey
            </a>
          </div>

          {/* Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Filter by company name..."
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={fetchResponses}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-2xl font-bold text-blue-600">
              {responses.length > 0
                ? (
                    responses.reduce((sum, r) => sum + r.percentage_score, 0) /
                    responses.length
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-600">Companies Surveyed</p>
            <p className="text-2xl font-bold text-green-600">
              {uniqueCompanies.length}
            </p>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <p className="text-sm text-gray-600">Responses This Month</p>
            <p className="text-2xl font-bold text-purple-600">
              {
                responses.filter((r) => {
                  const responseDate = new Date(r.submitted_at);
                  const now = new Date();
                  return (
                    responseDate.getMonth() === now.getMonth() &&
                    responseDate.getFullYear() === now.getFullYear()
                  );
                }).length
              }
            </p>
          </div>
        </div>

        {/* Responses List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Respondent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quarter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No responses found
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {response.company_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {response.respondent_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {response.respondent_email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {response.quarter || '-'} {response.policy_year || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {response.percentage_score.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {response.total_score}/{response.max_possible_score}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(response.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedResponse(response)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedResponse.company_name}
                  </h2>
                  <p className="text-gray-600">
                    Submitted by {selectedResponse.respondent_name} on{' '}
                    {new Date(selectedResponse.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Score Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedResponse.total_score}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Max Score</p>
                    <p className="text-2xl font-bold text-gray-700">
                      {selectedResponse.max_possible_score}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Percentage</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedResponse.percentage_score.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              {SURVEY_CATEGORIES.map((category) => {
                const categoryScores = selectedResponse.scores[category.id] || {};
                const categoryComment = selectedResponse.comments[category.id] || '';

                return (
                  <div key={category.id} className="mb-6 border-b pb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {category.name} ({category.weight}%)
                    </h3>

                    <div className="space-y-2">
                      {category.questions.map((question) => (
                        <div
                          key={question.id}
                          className="flex justify-between items-start"
                        >
                          <p className="text-sm text-gray-700 flex-1">
                            {question.question}
                          </p>
                          <span className="text-sm font-semibold text-blue-600 ml-4">
                            {categoryScores[question.id] || 0} / {question.maxScore}
                          </span>
                        </div>
                      ))}
                    </div>

                    {categoryComment && (
                      <div className="mt-3 bg-gray-50 p-3 rounded">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Comments:
                        </p>
                        <p className="text-sm text-gray-700">{categoryComment}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
