import { notFound } from 'next/navigation';
import SurveyForm from '@/components/SurveyForm';
import { SurveyConfiguration } from '@/types/survey';
import { supabase } from '@/lib/supabase';

async function getSurveyConfig(slug: string): Promise<SurveyConfiguration | null> {
  try {
    // Fetch instance by slug directly from Supabase
    const { data: instance, error: instanceError } = await supabase
      .from('survey_instances')
      .select(`
        *,
        companies (id, name, contact_email),
        survey_templates (id, name, description)
      `)
      .eq('url_slug', slug)
      .single();

    if (instanceError || !instance) {
      console.error('Error fetching instance:', instanceError);
      return null;
    }

    // Check if instance is active
    if (!instance.is_active) {
      return null;
    }

    // Check if expired
    if (instance.expires_at) {
      const expiryDate = new Date(instance.expires_at);
      if (expiryDate < new Date()) {
        return null;
      }
    }

    // Fetch visibility configuration
    const { data: visibility, error: visibilityError } = await supabase
      .from('survey_question_visibility')
      .select('*')
      .eq('config_id', instance.id)
      .eq('config_type', 'instance');

    if (visibilityError) {
      console.error('Error fetching visibility:', visibilityError);
      return null;
    }

    return {
      instance,
      company: instance.companies,
      template: instance.survey_templates,
      visibility: visibility || [],
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <SurveyForm configuration={config} />
      </div>
    </div>
  );
}
