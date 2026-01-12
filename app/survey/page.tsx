import SurveyForm from '@/components/SurveyForm';

export const metadata = {
  title: 'Submit Survey Response - SurveyHR',
  description: 'Submit your HR survey response',
};

export default function SurveyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SurveyForm />
    </div>
  );
}
