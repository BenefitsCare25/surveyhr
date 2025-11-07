import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SurveyTemplate, QuestionVisibility, SURVEY_CATEGORIES } from '@/types/survey';

// GET /api/templates - List all templates with visibility configs
export async function GET() {
  try {
    const { data: templates, error: templatesError } = await supabase
      .from('survey_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (templatesError) throw templatesError;

    // Fetch visibility configs for all templates
    const { data: visibility, error: visibilityError } = await supabase
      .from('survey_question_visibility')
      .select('*')
      .eq('config_type', 'template');

    if (visibilityError) throw visibilityError;

    // Combine templates with their visibility configs
    const templatesWithConfigs = (templates as SurveyTemplate[]).map(template => ({
      ...template,
      visibility: (visibility as QuestionVisibility[]).filter(
        v => v.config_id === template.id
      ),
    }));

    return NextResponse.json({ templates: templatesWithConfigs });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, visibility } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Template name is required' },
        { status: 400 }
      );
    }

    // Create template
    const { data: template, error: templateError } = await supabase
      .from('survey_templates')
      .insert([{ name, description }])
      .select()
      .single();

    if (templateError) throw templateError;

    // If no visibility config provided, create default (all visible)
    const visibilityRecords = visibility && visibility.length > 0
      ? visibility.map((v: Partial<QuestionVisibility>) => ({
          config_id: template.id,
          config_type: 'template',
          category_id: v.category_id,
          question_id: v.question_id || null,
          is_visible: v.is_visible ?? true,
        }))
      : SURVEY_CATEGORIES.map(category => ({
          config_id: template.id,
          config_type: 'template',
          category_id: category.id,
          question_id: null, // Category-level
          is_visible: true,
        }));

    const { error: visibilityError } = await supabase
      .from('survey_question_visibility')
      .insert(visibilityRecords);

    if (visibilityError) throw visibilityError;

    // Fetch the complete template with visibility
    const { data: visibilityData } = await supabase
      .from('survey_question_visibility')
      .select('*')
      .eq('config_id', template.id)
      .eq('config_type', 'template');

    return NextResponse.json({
      template: {
        ...template,
        visibility: visibilityData,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// PUT /api/templates?id=xxx - Update template
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, visibility } = body;

    // Update template
    const { data: template, error: templateError } = await supabase
      .from('survey_templates')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single();

    if (templateError) throw templateError;

    // Update visibility if provided
    if (visibility) {
      // Delete existing visibility records
      await supabase
        .from('survey_question_visibility')
        .delete()
        .eq('config_id', id)
        .eq('config_type', 'template');

      // Insert new visibility records
      const visibilityRecords = visibility.map((v: Partial<QuestionVisibility>) => ({
        config_id: id,
        config_type: 'template',
        category_id: v.category_id,
        question_id: v.question_id || null,
        is_visible: v.is_visible ?? true,
      }));

      await supabase
        .from('survey_question_visibility')
        .insert(visibilityRecords);
    }

    // Fetch updated visibility
    const { data: visibilityData } = await supabase
      .from('survey_question_visibility')
      .select('*')
      .eq('config_id', id)
      .eq('config_type', 'template');

    return NextResponse.json({
      template: {
        ...template,
        visibility: visibilityData,
      },
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE /api/templates?id=xxx - Delete template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Delete visibility records first
    await supabase
      .from('survey_question_visibility')
      .delete()
      .eq('config_id', id)
      .eq('config_type', 'template');

    // Delete template
    const { error } = await supabase
      .from('survey_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
