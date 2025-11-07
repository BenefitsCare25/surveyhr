'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import PasswordGate from '@/components/PasswordGate';
import FilterPanel from '@/components/FilterPanel';
import ExportButton from '@/components/ExportButton';
import ResponseDetailsModal from '@/components/ResponseDetailsModal';

interface SurveyResponse {
  id: string;
  company_name: string;
  respondent_name: string;
  respondent_email: string;
  quarter?: string;
  policy_year?: string;
  submitted_at: string;
  scores: Record<string, Record<string, number>>;
  comments: Record<string, string>;
  total_score: number;
  max_possible_score: number;
  percentage_score: number;
}

type SortField = 'company_name' | 'respondent_name' | 'percentage_score' | 'submitted_at';
type SortDirection = 'asc' | 'desc';

export default function DashboardPage() {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  // Filter states
  const [companyFilter, setCompanyFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [quarterFilter, setQuarterFilter] = useState('');
  const [policyYearFilter, setPolicyYearFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Sort state
  const [sortField, setSortField] = useState<SortField>('submitted_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const handleClearFilters = () => {
    setCompanyFilter('');
    setEmailFilter('');
    setQuarterFilter('');
    setPolicyYearFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setCurrentPage(1);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Get unique companies for filter dropdown
  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(responses.map((r) => r.company_name))).sort();
  }, [responses]);

  // Apply filters and sorting
  const filteredAndSortedResponses = useMemo(() => {
    let filtered = responses.filter((response) => {
      // Company filter
      if (companyFilter && response.company_name !== companyFilter) {
        return false;
      }

      // Email filter
      if (
        emailFilter &&
        !response.respondent_email.toLowerCase().includes(emailFilter.toLowerCase())
      ) {
        return false;
      }

      // Quarter filter
      if (quarterFilter && response.quarter !== quarterFilter) {
        return false;
      }

      // Policy year filter
      if (policyYearFilter && response.policy_year !== policyYearFilter) {
        return false;
      }

      // Date from filter
      if (dateFromFilter) {
        const responseDate = new Date(response.submitted_at);
        const fromDate = new Date(dateFromFilter);
        if (responseDate < fromDate) {
          return false;
        }
      }

      // Date to filter
      if (dateToFilter) {
        const responseDate = new Date(response.submitted_at);
        const toDate = new Date(dateToFilter);
        toDate.setHours(23, 59, 59, 999); // End of day
        if (responseDate > toDate) {
          return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'submitted_at') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    responses,
    companyFilter,
    emailFilter,
    quarterFilter,
    policyYearFilter,
    dateFromFilter,
    dateToFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedResponses.length / itemsPerPage);
  const paginatedResponses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedResponses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedResponses, currentPage]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: responses.length,
      filtered: filteredAndSortedResponses.length,
      avgScore:
        filteredAndSortedResponses.length > 0
          ? (
              filteredAndSortedResponses.reduce((sum, r) => sum + r.percentage_score, 0) /
              filteredAndSortedResponses.length
            ).toFixed(1)
          : '0',
      companies: uniqueCompanies.length,
      thisMonth: responses.filter((r) => {
        const responseDate = new Date(r.submitted_at);
        const now = new Date();
        return (
          responseDate.getMonth() === now.getMonth() &&
          responseDate.getFullYear() === now.getFullYear()
        );
      }).length,
    };
  }, [responses, filteredAndSortedResponses, uniqueCompanies]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }
    return <span className="text-blue-600 ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (loading) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </PasswordGate>
    );
  }

  if (error) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          </div>
        </div>
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Survey Responses Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Showing {stats.filtered} of {stats.total} responses
                </p>
              </div>
              <div className="flex gap-2">
                <ExportButton responses={filteredAndSortedResponses} />
                <a
                  href="/survey"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                >
                  Submit Survey →
                </a>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-blue-600">{stats.avgScore}%</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Companies</p>
              <p className="text-3xl font-bold text-green-600">{stats.companies}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
            </div>
          </div>

          {/* Filters */}
          <FilterPanel
            companyFilter={companyFilter}
            setCompanyFilter={setCompanyFilter}
            emailFilter={emailFilter}
            setEmailFilter={setEmailFilter}
            quarterFilter={quarterFilter}
            setQuarterFilter={setQuarterFilter}
            policyYearFilter={policyYearFilter}
            setPolicyYearFilter={setPolicyYearFilter}
            dateFromFilter={dateFromFilter}
            setDateFromFilter={setDateFromFilter}
            dateToFilter={dateToFilter}
            setDateToFilter={setDateToFilter}
            onClearFilters={handleClearFilters}
            companies={uniqueCompanies}
          />

          {/* Responses Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('company_name')}
                    >
                      Company <SortIcon field="company_name" />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('respondent_name')}
                    >
                      Respondent <SortIcon field="respondent_name" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quarter / Year
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('percentage_score')}
                    >
                      Score <SortIcon field="percentage_score" />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('submitted_at')}
                    >
                      Submitted <SortIcon field="submitted_at" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedResponses.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        {filteredAndSortedResponses.length === 0 && responses.length > 0
                          ? 'No responses match your filters'
                          : 'No responses found'}
                      </td>
                    </tr>
                  ) : (
                    paginatedResponses.map((response) => (
                      <tr
                        key={response.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedResponse(response)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {response.company_name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{response.respondent_name}</div>
                          <div className="text-sm text-gray-500">{response.respondent_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {response.quarter || '-'} {response.policy_year && `/ ${response.policy_year}`}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedResponse(response);
                            }}
                            className="text-blue-600 hover:text-blue-900 font-medium"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Response Details Modal */}
      <ResponseDetailsModal response={selectedResponse} onClose={() => setSelectedResponse(null)} />
    </PasswordGate>
  );
}
