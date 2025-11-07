'use client';

interface FilterPanelProps {
  companyFilter: string;
  setCompanyFilter: (value: string) => void;
  emailFilter: string;
  setEmailFilter: (value: string) => void;
  quarterFilter: string;
  setQuarterFilter: (value: string) => void;
  policyYearFilter: string;
  setPolicyYearFilter: (value: string) => void;
  dateFromFilter: string;
  setDateFromFilter: (value: string) => void;
  dateToFilter: string;
  setDateToFilter: (value: string) => void;
  onClearFilters: () => void;
  companies: string[];
}

export default function FilterPanel({
  companyFilter,
  setCompanyFilter,
  emailFilter,
  setEmailFilter,
  quarterFilter,
  setQuarterFilter,
  policyYearFilter,
  setPolicyYearFilter,
  dateFromFilter,
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
  onClearFilters,
  companies,
}: FilterPanelProps) {
  const hasActiveFilters =
    companyFilter ||
    emailFilter ||
    quarterFilter ||
    policyYearFilter ||
    dateFromFilter ||
    dateToFilter;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Company Filter */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            id="company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All companies</option>
            {companies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* Email Filter */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Respondent Email
          </label>
          <input
            type="text"
            id="email"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            placeholder="Search by email..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quarter Filter */}
        <div>
          <label htmlFor="quarter" className="block text-sm font-medium text-gray-700 mb-1">
            Quarter
          </label>
          <select
            id="quarter"
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All quarters</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        </div>

        {/* Policy Year Filter */}
        <div>
          <label htmlFor="policyYear" className="block text-sm font-medium text-gray-700 mb-1">
            Policy Year
          </label>
          <input
            type="text"
            id="policyYear"
            value={policyYearFilter}
            onChange={(e) => setPolicyYearFilter(e.target.value)}
            placeholder="e.g., 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date From Filter */}
        <div>
          <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
            Submitted From
          </label>
          <input
            type="date"
            id="dateFrom"
            value={dateFromFilter}
            onChange={(e) => setDateFromFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Date To Filter */}
        <div>
          <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
            Submitted To
          </label>
          <input
            type="date"
            id="dateTo"
            value={dateToFilter}
            onChange={(e) => setDateToFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
