import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { QuestionVisibility } from '@/types/survey';

// POST /api/instances/[id]/visibility - Update visibility settings for an instance
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { visibility } = body;

    if (!visibility || !Array.isArray(visibility)) {
      return NextResponse.json(
        { error: 'Visibility array is required' },
        { status: 400 }
      );
    }

    // Prepare visibility records for insertion
    const visibilityRecords = visibility.map((v: QuestionVisibility) => ({
      config_id: id,
      config_type: 'instance',
      category_id: v.category_id,
      question_id: v.question_id || null,
      is_visible: v.is_visible,
    }));

    // Insert new visibility settings
    const { error: insertError } = await supabase
      .from('survey_question_visibility')
      .insert(visibilityRecords);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating instance visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update visibility' },
      { status: 500 }
    );
  }
}

// DELETE /api/instances/[id]/visibility - Delete all visibility settings for an instance
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('survey_question_visibility')
      .delete()
      .eq('config_id', id)
      .eq('config_type', 'instance');

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting instance visibility:', error);
    return NextResponse.json(
      { error: 'Failed to delete visibility' },
      { status: 500 }
    );
  }
}
