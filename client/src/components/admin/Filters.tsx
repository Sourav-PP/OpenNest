import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Option = {
  label: string;
  value: string;
};

interface FilterConfig {
  type: 'search' | 'select';
  key: string;
  placeholder?: string;
  options?: Option[];
}

interface FiltersProps {
  config: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  resetPage?: () => void;
}

const Filters: React.FC<FiltersProps> = ({ config, values, onChange, resetPage }) => {
  const searchFilter = config.find(filter => filter.type === 'search');
  const selectFilters = config.filter(filter => filter.type === 'select');

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-transparent rounded-xl">
      {/* Search Input (Left Side) */}
      {searchFilter && (
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Input
            placeholder={searchFilter.placeholder || 'Search...'}
            value={values[searchFilter.key] || ''}
            onChange={e => {
              onChange(searchFilter.key, e.target.value);
              resetPage?.();
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-admin-bg-secondary text-white placeholder-gray-400 focus:ring-2 focus:ring-admin-gb-box-active focus:outline-none border border-gray-600 transition-all duration-200 hover:bg-admin-bg-box"
          />
        </div>
      )}

      {/* Select Filters (Right Side) */}
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        {selectFilters.map(filter => (
          filter.options && (
            <Select
              key={filter.key}
              value={values[filter.key] || ''}
              onValueChange={value => {
                onChange(filter.key, value);
                resetPage?.();
              }}
            >
              <SelectTrigger className="w-full sm:w-40 bg-admin-bg-secondary text-white border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:bg-gray-600">
                <SelectValue placeholder={filter.placeholder || 'Select...'} />
              </SelectTrigger>
              <SelectContent className="bg-admin-bg-secondary text-white border-gray-600 rounded-lg">
                {filter.options.map(opt => (
                  <SelectItem key={opt.value} value={opt.value} className="hover:bg-gray-600">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        ))}
      </div>
    </div>
  );
};

export default Filters;