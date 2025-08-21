import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConsultationFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  sort: 'asc' | 'desc';
  setSort: (value: 'asc' | 'desc') => void;
  status: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all';
  setStatus: (value: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all') => void;
  setCurrentPage: (page: number) => void;
}

const ConsultationFilters: React.FC<ConsultationFiltersProps> = ({
  search,
  setSearch,
  sort,
  setSort,
  status,
  setStatus,
  setCurrentPage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
      <Input
        placeholder="Search by session goal or psychologist"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full sm:w-80 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
        aria-label="Search consultations"
      />
      <Select
        value={sort}
        onValueChange={(value) => {
          setSort(value as 'asc' | 'desc');
          setCurrentPage(1);
        }}
      >
        <SelectTrigger
          className="w-full sm:w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          aria-label="Sort consultations by date"
        >
          <SelectValue placeholder="Sort by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Start Date Asc</SelectItem>
          <SelectItem value="desc">Start Date Desc</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value as 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all');
          setCurrentPage(1);
        }}
      >
        <SelectTrigger
          className="w-full sm:w-40 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          aria-label="Filter consultations by status"
        >
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="booked">Booked</SelectItem>
          <SelectItem value="cancelled">Canceled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="rescheduled">Rescheduled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ConsultationFilters;