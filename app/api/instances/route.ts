import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { supabase } from '@/lib/supabase';
import { SurveyInstance, QuestionVisibility } from '@/types/survey';

// GET /api/instances - List all survey instances
export async function GET() {
  try {
    const { data: instances, error: instancesError } = await supabase
      .from('survey_instances')
      .select(`
        *,
        companies (id, name, contact_email),
        survey_templates (id, name)
      `)
      .order('created_at', { ascending: false });

    if (instancesError) throw instancesError;

    return NextResponse.json({ instances });
  } catch (error) {
    console.error('Error fetching instances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch instances' },
      { status: 500 }
    );
  }
}

// POST /api/instances - Create new survey instance (clone from template)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template_id, company_id, name, expires_at } = body;

    if (!template_id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Instance name is required' },
        { status: 400 }
      );
    }

    // Generate unique URL slug
    const url_slug = nanoid(10);

    // Create instance
    const { data: instance, error: instanceError } = await supabase
      .from('survey_instances')
      .insert([{
        template_id,
        company_id: company_id || null,
        url_slug,
        name,
        is_active: true,
        expires_at: expires_at || null,
      }])
      .select()
      .single();

    if (instanceError) throw instanceError;

    // Clone visibility settings from template
    const { data: templateVisibility, error: visibilityFetchError } = await supabase
      .from('survey_question_visibility')
      .select('*')
      .eq('config_id', template_id)
      .eq('config_type', 'template');

    if (visibilityFetchError) throw visibilityFetchError;

    if (templateVisibility && templateVisibility.length > 0) {
      const instanceVisibility = templateVisibility.map((v: QuestionVisibility) => ({
        config_id: instance.id,
        config_type: 'instance',
        category_id: v.category_id,
        question_id: v.question_id,
        is_visible: v.is_visible,
      }));

      const { error: visibilityInsertError } = await supabase
        .from('survey_question_visibility')
        .insert(instanceVisibility);

      if (visibilityInsertError) throw visibilityInsertError;
    }

    // Fetch complete instance with relations
    const { data: completeInstance } = await supabase
      .from('survey_instances')
      .select(`
        *,
        companies (id, name, contact_email),
        survey_templates (id, name)
      `)
      .eq('id', instance.id)
      .single();

    // Fetch visibility
    const { data: visibilityData } = await supabase
      .from('survey_question_visibility')
      .select('*')
      .eq('config_id', instance.id)
      .eq('config_type', 'instance');

    return NextResponse.json({
      instance: {
        ...completeInstance,
        visibility: visibilityData,
      },
      survey_url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/survey/${url_slug}`,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating instance:', error);
    return NextResponse.json(
      { error: 'Failed to create survey instance' },
      { status: 500 }
    );
  }
}

// PATCH /api/instances?id=xxx - Update instance (toggle active status, etc.)
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Instance ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { is_active, name, expires_at } = body;

    const updateData: Partial<SurveyInstance> = {};
    if (is_active !== undefined) updateData.is_active = is_active;
    if (name) updateData.name = name;
    if (expires_at !== undefined) updateData.expires_at = expires_at;

    const { data, error } = await supabase
      .from('survey_instances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ instance: data });
  } catch (error) {
    console.error('Error updating instance:', error);
    return NextResponse.json(
      { error: 'Failed to update instance' },
      { status: 500 }
    );
  }
}

// DELETE /api/instances?id=xxx - Delete instance
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Instance ID is required' },
        { status: 400 }
      );
    }

    // Delete visibility records first
    await supabase
      .from('survey_question_visibility')
      .delete()
      .eq('config_id', id)
      .eq('config_type', 'instance');

    // Delete instance
    const { error } = await supabase
      .from('survey_instances')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting instance:', error);
    return NextResponse.json(
      { error: 'Failed to delete instance' },
      { status: 500 }
    );
  }
}
