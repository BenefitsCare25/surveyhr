// CSV export utility for survey responses

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

export function exportToCSV(responses: SurveyResponse[], filename = 'survey-responses.csv'): void {
  // Define headers
  const headers = [
    'ID',
    'Company Name',
    'Respondent Name',
    'Respondent Email',
    'Submitted At',
    'Total Score',
    'Max Possible Score',
    'Percentage Score (%)',
    'Service Admin Score',
    'Service Admin Comment',
    'Claims Admin Score',
    'Claims Admin Comment',
    'Customer Service Score',
    'Customer Service Comment',
    'Presentation Score',
    'Presentation Comment',
    'Staff Handbook Score',
    'Staff Handbook Comment',
    'Renewal Review Score',
    'Renewal Review Comment',
  ];

  // Convert responses to CSV rows
  const rows = responses.map(response => {
    const scores = response.scores || {};
    const comments = response.comments || {};

    return [
      response.id || '',
      response.company_name || '',
      response.respondent_name || '',
      response.respondent_email || '',
      new Date(response.submitted_at).toLocaleString(),
      response.total_score?.toString() || '0',
      response.max_possible_score?.toString() || '0',
      response.percentage_score?.toFixed(2) || '0',
      scores.service_admin?.overall?.toString() || '0',
      comments.service_admin || '',
      scores.claims_admin?.overall?.toString() || '0',
      comments.claims_admin || '',
      scores.customer_service?.overall?.toString() || '0',
      comments.customer_service || '',
      scores.presentation?.overall?.toString() || '0',
      comments.presentation || '',
      scores.staff_handbook?.overall?.toString() || '0',
      comments.staff_handbook || '',
      scores.renewal_review?.overall?.toString() || '0',
      comments.renewal_review || '',
    ].map(field => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const value = String(field);
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
