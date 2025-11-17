'use client';

import { useState, useEffect } from 'react';
import { SurveyTemplate, Company, SurveyInstance, QuestionVisibility } from '@/types/survey';
import QuestionToggleTree from './QuestionToggleTree';

interface InstanceWithRelations extends SurveyInstance {
  companies?: Company;
  survey_templates?: SurveyTemplate;
  visibility?: QuestionVisibility[];
}

export default function SurveyInstanceCreator() {
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [instances, setInstances] = useState<InstanceWithRelations[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    template_id: '',
    company_name: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [editingInstance, setEditingInstance] = useState<InstanceWithRelations | null>(null);
  const [editVisibility, setEditVisibility] = useState<QuestionVisibility[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [templatesRes, companiesRes, instancesRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/companies'),
        fetch('/api/instances'),
      ]);

      const [templatesData, companiesData, instancesData] = await Promise.all([
        templatesRes.json(),
        companiesRes.json(),
        instancesRes.json(),
      ]);

      setTemplates(templatesData.templates || []);
      setCompanies(companiesData.companies || []);
      setInstances(instancesData.instances || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCreateInstance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedUrl(null);

    try {
      const res = await fetch('/api/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create survey instance');

      const data = await res.json();
      setGeneratedUrl(data.survey_url);
      await fetchData();
      setFormData({ template_id: '', company_name: '', name: '' });
    } catch (error) {
      console.error('Error creating instance:', error);
      alert('Failed to create survey instance');
    } finally {
      setLoading(false);
    }
  };


  const toggleInstanceActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/instances?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!res.ok) throw new Error('Failed to update instance');
      await fetchData();
    } catch (error) {
      console.error('Error updating instance:', error);
      alert('Failed to update instance status');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Survey URL copied to clipboard!');
  };

  const startEditingInstance = (instance: InstanceWithRelations) => {
    setEditingInstance(instance);
    setEditVisibility(instance.visibility || []);
  };

  const cancelEditInstance = () => {
    setEditingInstance(null);
    setEditVisibility([]);
  };

  const handleSaveInstanceVisibility = async () => {
    if (!editingInstance) return;

    try {
      setLoading(true);

      // Update visibility settings
      const res = await fetch(`/api/instances/visibility?id=${editingInstance.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: editVisibility }),
      });

      if (!res.ok) throw new Error('Failed to update visibility');

      await fetchData();
      cancelEditInstance();
      alert('Survey questions updated successfully!');
    } catch (error) {
      console.error('Error updating instance visibility:', error);
      alert('Failed to update survey questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Survey Links</h2>
          <p className="text-gray-600 text-sm mt-1">
            Generate unique survey links from templates
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Generate Link'}
        </button>
      </div>

      {/* Create Instance Form */}
      {showForm && (
        <form onSubmit={handleCreateInstance} className="bg-white border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Generate New Survey Link</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.template_id}
              onChange={(e) => setFormData({ ...formData, template_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {templates.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                No templates available. Create a template first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="No company (generic link)"
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Survey Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Q1 2024 Survey - Company ABC"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.template_id || !formData.name}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Survey Link'}
          </button>
        </form>
      )}

      {/* Generated URL Display */}
      {generatedUrl && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Survey Link Generated!</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={generatedUrl}
              readOnly
              className="flex-1 border rounded-lg p-2 bg-white font-mono text-sm"
            />
            <button
              onClick={() => copyToClipboard(generatedUrl)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Edit Instance Modal */}
      {editingInstance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Survey Questions: {editingInstance.name}
              </h2>
              <button
                onClick={cancelEditInstance}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Customize which questions appear in this specific survey link
              </p>

              <QuestionToggleTree
                visibility={editVisibility}
                onChange={setEditVisibility}
                configId={editingInstance.id}
                configType="instance"
              />
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={handleSaveInstanceVisibility}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={cancelEditInstance}
                disabled={loading}
                className="border px-6 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instances List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg text-gray-900">Generated Survey Links</h3>

        {instances.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No survey links generated yet
          </div>
        ) : (
          instances.map((instance) => (
            <div
              key={instance.id}
              className={`bg-white border rounded-lg p-4 ${!instance.is_active ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{instance.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded ${instance.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                    >
                      {instance.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {instance.company_name && (
                    <p className="text-sm text-gray-600 mt-1">
                      Company: {instance.company_name}
                    </p>
                  )}
                  {instance.survey_templates && (
                    <p className="text-sm text-gray-500">
                      Template: {instance.survey_templates.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditingInstance(instance)}
                    className="text-sm px-3 py-1 rounded transition text-blue-600 hover:bg-blue-50"
                  >
                    Edit Questions
                  </button>
                  <button
                    onClick={() => toggleInstanceActive(instance.id, instance.is_active)}
                    className={`text-sm px-3 py-1 rounded transition ${instance.is_active ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                  >
                    {instance.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 items-center bg-gray-50 p-2 rounded mt-3">
                <span className="text-xs text-gray-700 font-mono flex-1 truncate">
                  {typeof window !== 'undefined' && `${window.location.origin}/survey/${instance.url_slug}`}
                </span>
                <button
                  onClick={() => copyToClipboard(`${window.location.origin}/survey/${instance.url_slug}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 transition flex-shrink-0"
                >
                  Copy URL
                </button>
              </div>

              <div className="text-xs text-gray-400 mt-2">
                Created {new Date(instance.created_at).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
