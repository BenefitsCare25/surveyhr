'use client';

import { useState, useEffect } from 'react';
import { SurveyTemplate, QuestionVisibility, SURVEY_CATEGORIES } from '@/types/survey';
import QuestionToggleTree from './QuestionToggleTree';

export default function TemplateManager() {
  const [templates, setTemplates] = useState<(SurveyTemplate & { visibility: QuestionVisibility[] })[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formVisibility, setFormVisibility] = useState<QuestionVisibility[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      const data = await res.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingTemplate(null);
    setFormData({ name: '', description: '' });
    // Initialize with all categories visible
    setFormVisibility(
      SURVEY_CATEGORIES.map(cat => ({
        id: '',
        config_id: '',
        config_type: 'template',
        category_id: cat.id,
        question_id: null,
        is_visible: true,
        created_at: new Date().toISOString(),
      }))
    );
  };

  const startEditing = (template: SurveyTemplate & { visibility: QuestionVisibility[] }) => {
    setEditingTemplate(template.id);
    setIsCreating(false);
    setFormData({ name: template.name, description: template.description || '' });
    setFormVisibility(template.visibility);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingTemplate(null);
    setFormData({ name: '', description: '' });
    setFormVisibility([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTemplate) {
        // Update existing template
        const res = await fetch(`/api/templates?id=${editingTemplate}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            visibility: formVisibility,
          }),
        });

        if (!res.ok) throw new Error('Failed to update template');
      } else {
        // Create new template
        const res = await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            visibility: formVisibility,
          }),
        });

        if (!res.ok) throw new Error('Failed to create template');
      }

      await fetchTemplates();
      cancelForm();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const res = await fetch(`/api/templates?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete template');
      await fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Failed to delete template');
    }
  };

  const countVisibleItems = (visibility: QuestionVisibility[]) => {
    const visibleCategories = SURVEY_CATEGORIES.filter(cat => {
      const catVis = visibility.find(v => v.category_id === cat.id && v.question_id === null);
      return catVis?.is_visible ?? true;
    });

    const visibleQuestions = visibility.filter(v => v.question_id !== null && v.is_visible).length;

    return { categories: visibleCategories.length, questions: visibleQuestions };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Survey Templates</h2>
          <p className="text-gray-600 text-sm mt-1">
            Create reusable templates to quickly generate custom surveys
          </p>
        </div>
        {!isCreating && !editingTemplate && (
          <button
            onClick={startCreating}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Create Template
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingTemplate) && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg p-2"
              placeholder="e.g., Q1 2024 Survey Template"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg p-2"
              rows={3}
              placeholder="Optional description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              Question Configuration
            </label>
            <QuestionToggleTree
              visibility={formVisibility}
              onChange={setFormVisibility}
              configId={editingTemplate || 'new'}
              configType="template"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Template'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              disabled={loading}
              className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Templates List */}
      <div className="space-y-3">
        {templates.length === 0 && !isCreating && !editingTemplate && (
          <div className="text-center py-12 text-gray-500">
            No templates yet. Create one to get started!
          </div>
        )}

        {templates.map((template) => {
          const counts = countVisibleItems(template.visibility);

          return (
            <div
              key={template.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>{counts.categories} / {SURVEY_CATEGORIES.length} categories</span>
                    <span className="text-gray-300">|</span>
                    <span>Created {new Date(template.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(template)}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
