'use client';

import { exportToCSV } from '@/lib/exportCSV';

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

interface ExportButtonProps {
  responses: SurveyResponse[];
  disabled?: boolean;
}

export default function ExportButton({ responses, disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    if (responses.length === 0) {
      alert('No responses to export');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `survey-responses-${timestamp}.csv`;

    exportToCSV(responses, filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || responses.length === 0}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        disabled || responses.length === 0
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      <span className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export to CSV ({responses.length})
      </span>
    </button>
  );
}
