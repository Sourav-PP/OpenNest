import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import Filters from '@/components/admin/Filters';
import { format } from 'date-fns';
import type { IConsultationDtoForAdmin } from '@/types/dtos/consultation';
import {
  ConsultationStatusColors,
  ConsultationStatusFilter,
  type ConsultationStatusFilterType,
  type ConsultationStatusType,
} from '@/constants/types/Consultation';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { handleApiError } from '@/lib/utils/handleApiError';
import { generalMessages } from '@/messages/GeneralMessages';
import type { Column } from '@/types/dtos/table';
import { textColumn } from '@/components/user/TableColumns';

const ITEMS_PER_PAGE = 10;

const consultationColumns: Column<IConsultationDtoForAdmin>[] = [
  textColumn<IConsultationDtoForAdmin>('Patient', c => c.patientName, 'px-6 py-4'),

  textColumn<IConsultationDtoForAdmin>('Psychologist', c => c.psychologistName, 'px-6 py-4'),

  textColumn<IConsultationDtoForAdmin>(
    'Start Time',
    c => format(new Date(c.startDateTime), 'dd MMM yyyy, hh:mm a'),
    'px-6 py-4'
  ),

  textColumn<IConsultationDtoForAdmin>(
    'End Time',
    c => format(new Date(c.endDateTime), 'dd MMM yyyy, hh:mm a'),
    'px-6 py-4'
  ),

  textColumn<IConsultationDtoForAdmin>('Session Goal', c => c.sessionGoal, 'px-6 py-4'),

  {
    header: 'Status',
    render: c => {
      const status = c.status as ConsultationStatusType;
      const statusClass = ConsultationStatusColors[status] || 'bg-gray-500';
      return <span className={`px-2 py-1 rounded-full text-xs ${statusClass}`}>{c.status}</span>;
    },
    className: 'px-6 py-4',
  },

  textColumn<IConsultationDtoForAdmin>('Payment', c => c.paymentStatus ?? 'subscription', 'px-6 py-4'),
];

const filterConfig = [
  {
    type: 'search' as const,
    key: 'search',
    placeholder: 'Search by patient or psychologist',
  },
  {
    type: 'select' as const,
    key: 'status',
    placeholder: 'Filter by status',
    options: [
      { label: 'All', value: ConsultationStatusFilter.All },
      { label: 'Booked', value: ConsultationStatusFilter.Booked },
      { label: 'Completed', value: ConsultationStatusFilter.Completed },
      { label: 'Cancelled', value: ConsultationStatusFilter.Cancelled },
      { label: 'Rescheduled', value: ConsultationStatusFilter.Rescheduled },
    ],
  },
  {
    type: 'select' as const,
    key: 'sort',
    placeholder: 'Sort by',
    options: [
      { label: 'Newest First', value: SortFilter.Desc },
      { label: 'Oldest First', value: SortFilter.Asc },
    ],
  },
];

const ConsultationTable = () => {
  const [consultations, setConsultations] = useState<IConsultationDtoForAdmin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{
    search: string;
    status: ConsultationStatusFilterType;
    sort: SortFilterType;
  }>({
    search: '',
    status: ConsultationStatusFilter.All,
    sort: SortFilter.Desc,
  });

  const fetchConsultations = useCallback(async () => {
    try {
      const res = await adminApi.getAllConsultations({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: filters.search,
        sort: filters.sort,
        status: filters.status,
      });

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setConsultations(res.data.consultations);
      setTotalCount(res.data.totalCount ?? res.data.consultations.length);
    } catch (err) {
      handleApiError(err);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-white mb-6">Consultation Management</h2>

      <Filters
        config={filterConfig}
        values={filters}
        onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        resetPage={() => setCurrentPage(1)}
      />

      <ReusableTable
        data={consultations}
        columns={consultationColumns}
        emptyMessage="No consultations found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />

      <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default ConsultationTable;
