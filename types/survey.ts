// Survey category structure based on the PDF
export interface CategoryQuestion {
  id: string;
  question: string;
  maxScore: number;
}

export interface Category {
  id: string;
  name: string;
  weight: number; // Percentage weight in total score
  questions: CategoryQuestion[];
  hasOverallSatisfaction: boolean;
}

export interface SurveyResponse {
  // Metadata
  companyName: string;
  respondentName: string;
  respondentEmail: string;
  quarter?: string;
  policyYear?: string;
  submittedAt: Date;

  // Scores: category_id -> question_id -> rating (1-5)
  scores: Record<string, Record<string, number>>;

  // Comments: category_id -> comment text
  comments: Record<string, string>;

  // Calculated totals
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
}

// Survey structure from PDF
export const SURVEY_CATEGORIES: Category[] = [
  {
    id: 'service_admin',
    name: 'Our Service Administration',
    weight: 15,
    questions: [
      { id: 'policy_docs', question: 'Issuance of Policy Documents / Billing', maxScore: 5 },
      { id: 'accuracy', question: 'Accuracy of Policy Document / Billing', maxScore: 5 },
      { id: 'premium_followup', question: 'Promptness in the follow-up on premium payment', maxScore: 5 },
      { id: 'overall', question: 'Overall Satisfaction of Service Administration', maxScore: 15 },
    ],
    hasOverallSatisfaction: true,
  },
  {
    id: 'claims_admin',
    name: 'Our Claims Administration',
    weight: 15,
    questions: [
      { id: 'speediness', question: 'Speediness of settlement of reimbursement of claims', maxScore: 5 },
      { id: 'accuracy', question: 'Accuracy of claims assessment', maxScore: 5 },
      { id: 'followup', question: 'Follow-up with employees with missing claim documents', maxScore: 5 },
      { id: 'overall', question: 'Overall satisfaction of Claim Administration', maxScore: 15 },
    ],
    hasOverallSatisfaction: true,
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    weight: 20,
    questions: [
      { id: 'professionalism', question: 'Professionalism of customer service personnel', maxScore: 5 },
      { id: 'knowledge', question: 'Products and claims knowledge of our customer service personnel', maxScore: 5 },
      { id: 'response', question: 'Response to queries', maxScore: 5 },
      { id: 'facilitation', question: 'Facilitation support with third party medical provider', maxScore: 5 },
      { id: 'overall', question: 'Overall satisfaction', maxScore: 20 },
    ],
    hasOverallSatisfaction: true,
  },
  {
    id: 'presentation',
    name: 'Presentation',
    weight: 10,
    questions: [
      { id: 'monthly_reports', question: 'Monthly reports (By 3rd week of the following month)', maxScore: 5 },
      { id: 'quarterly_reports', question: 'Quarterly reports (By 4th week of the following month)', maxScore: 5 },
      { id: 'overall', question: 'Overall satisfaction of Staff Presentation', maxScore: 10 },
    ],
    hasOverallSatisfaction: true,
  },
  {
    id: 'staff_handbook',
    name: 'Staff Communication Handbook',
    weight: 10,
    questions: [
      { id: 'comprehensiveness', question: 'Comprehensiveness of the Handbook', maxScore: 5 },
      { id: 'clarity', question: 'Clarity of the Staff Handbook', maxScore: 5 },
      { id: 'overall', question: 'Overall satisfaction of Staff Communication Handbook', maxScore: 10 },
    ],
    hasOverallSatisfaction: true,
  },
  {
    id: 'renewal_review',
    name: 'Renewal Review',
    weight: 30,
    questions: [
      {
        id: 'pre_renewal',
        question: 'Pre Renewal Meeting (August - September): Plan the renewal strategies, propose enhancements, claims review, provide non-binding renewal terms',
        maxScore: 30,
      },
      {
        id: 'remarketing',
        question: 'Remarketing Exercise (September to October): Obtain quotes from other insurers to benchmark against renewal terms, Present and recommend renewal proposal',
        maxScore: 30,
      },
      { id: 'overall', question: 'Overall satisfaction of Renewal Review', maxScore: 30 },
    ],
    hasOverallSatisfaction: true,
  },
];
