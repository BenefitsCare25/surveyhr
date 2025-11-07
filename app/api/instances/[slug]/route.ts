import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/instances/[slug] - Get survey configuration by URL slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch instance by slug
    const { data: instance, error: instanceError } = await supabase
      .from('survey_instances')
      .select(`
        *,
        companies (id, name, contact_email),
        survey_templates (id, name, description)
      `)
      .eq('url_slug', slug)
      .single();

    if (instanceError) {
      if (instanceError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Survey not found' },
          { status: 404 }
        );
      }
      throw instanceError;
    }

    // Check if instance is active
    if (!instance.is_active) {
      return NextResponse.json(
        { error: 'Survey is no longer active' },
        { status: 410 } // Gone
      );
    }

    // Check if expired
    if (instance.expires_at) {
      const expiryDate = new Date(instance.expires_at);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { error: 'Survey has expired' },
          { status: 410 }
        );
      }
    }

    // Fetch visibility configuration
    const { data: visibility, error: visibilityError } = await supabase
      .from('survey_question_visibility')
      .select('*')
      .eq('config_id', instance.id)
      .eq('config_type', 'instance');

    if (visibilityError) throw visibilityError;

    return NextResponse.json({
      instance,
      visibility: visibility || [],
    });
  } catch (error) {
    console.error('Error fetching survey configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch survey configuration' },
      { status: 500 }
    );
  }
}
