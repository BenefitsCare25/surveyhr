import { notFound } from 'next/navigation';
import SurveyForm from '@/components/SurveyForm';
import { SurveyConfiguration } from '@/types/survey';

async function getSurveyConfig(slug: string): Promise<SurveyConfiguration | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/instances/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data = await res.json();
    return {
      instance: data.instance,
      company: data.instance?.companies,
      template: data.instance?.survey_templates,
      visibility: data.visibility || [],
    };
  } catch (error) {
    console.error('Error fetching survey config:', error);
    return null;
  }
}

export default async function DynamicSurveyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = await getSurveyConfig(slug);

  if (!config || !config.instance) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Customer Satisfaction Survey
          </h1>
          {config.company && (
            <p className="text-gray-600">
              Survey for: <span className="font-semibold">{config.company.name}</span>
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {config.instance.name}
          </p>
        </div>

        <SurveyForm configuration={config} />
      </div>
    </div>
  );
}
