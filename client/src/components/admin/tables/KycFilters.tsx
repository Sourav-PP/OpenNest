import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface KycFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  sort: 'asc' | 'desc';
  setSort: (value: 'asc' | 'desc') => void;
  status: 'pending' | 'approved' | 'rejected' | 'all';
  setStatus: (value: 'pending' | 'approved' | 'rejected' | 'all') => void;
  setCurrentPage: (page: number) => void;
}

const KycFilters: React.FC<KycFiltersProps> = ({
  search,
  setSearch,
  sort,
  setSort,
  status,
  setStatus,
  setCurrentPage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <Input
        placeholder="Search for Users"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="max-w-sm bg-admin-bg-box text-white hover:bg-transparent border-gray-700"
      />
      <div className="flex gap-4">
        <Select
          value={sort}
          onValueChange={(value) => {
            setSort(value as 'asc' | 'desc');
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="bg-admin-bg-box text-white border-gray-700">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-admin-bg-box text-white border-gray-700">
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as 'pending' | 'approved' | 'rejected' | 'all');
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="bg-admin-bg-box text-white border-gray-700">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent className="bg-admin-bg-box text-white border-gray-700">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default KycFilters;