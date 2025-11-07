import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Company } from '@/types/survey';

// GET /api/companies - List all companies
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ companies: data as Company[] });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, contact_email } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('companies')
      .insert([{ name, contact_email }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Company name already exists' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ company: data as Company }, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}

// DELETE /api/companies?id=xxx - Delete company
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
