import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  sort: 'asc' | 'desc';
  setSort: (value: 'asc' | 'desc') => void;
  gender: 'male' | 'female' | 'all';
  setGender: (value: 'male' | 'female' | 'all') => void;
  setCurrentPage: (page: number) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  search,
  setSearch,
  sort,
  setSort,
  gender,
  setGender,
  setCurrentPage,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-admin-bg-secondary rounded-x">
      <div className="relative w-full md:w-1/3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-admin-bg-box text-white placeholder-gray-400 focus:ring-2 hover:bg-transparent focus:ring-blue-500 focus:outline-none border border-gray-600"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={gender}
          onValueChange={(value) => {
            setGender(value as 'male' | 'female' | 'all');
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="bg-admin-bg-box text-white border-gray-700">
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent className="bg-admin-bg-box text-white border-gray-700">
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserFilters;
