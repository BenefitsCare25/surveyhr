'use client';

import { useState } from 'react';
import TemplateManager from './TemplateManager';
import SurveyInstanceCreator from './SurveyInstanceCreator';

type SubTab = 'templates' | 'links';

export default function ConfigurationTab() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('templates');

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveSubTab('templates')}
            className={`pb-4 px-1 border-b-2 font-medium transition ${
              activeSubTab === 'templates'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveSubTab('links')}
            className={`pb-4 px-1 border-b-2 font-medium transition ${
              activeSubTab === 'links'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Survey Links
          </button>
        </nav>
      </div>

      {/* Sub-tab content */}
      <div>
        {activeSubTab === 'templates' && <TemplateManager />}
        {activeSubTab === 'links' && <SurveyInstanceCreator />}
      </div>
    </div>
  );
}
