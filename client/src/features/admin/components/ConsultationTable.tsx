import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import Filters from '@/components/admin/Filters';
import { format } from 'date-fns';
import type { IConsultationDtoForAdmin } from '@/types/dtos/consultation';

const ConsultationTable = () => {
  const [consultations, setConsultations] = useState<IConsultationDtoForAdmin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'desc',
  });
  const itemsPerPage = 10;

  const fetchConsultations = useCallback(async () => {
    try {
      const res = await adminApi.getAllConsultations({
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search,
        sort: filters.sort as 'asc' | 'desc',
        status: filters.status as 'all' | 'booked' | 'completed' | 'cancelled' | 'rescheduled',
      });

      if (!res.data) {
        toast.error('Something went wrong');
        return;
      }

      setConsultations(res.data.consultations);
      setTotalCount(res.data.totalCount ?? res.data.consultations.length);
    } catch (err) {
      toast.error('Failed to fetch consultations');
      console.error(err);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const columns = [
    {
      header: 'Patient',
      render: (c: IConsultationDtoForAdmin) => <span>{c.patientName}</span>,
    },
    {
      header: 'Psychologist',
      render: (c: IConsultationDtoForAdmin) => <span>{c.psychologistName}</span>,
    },
    {
      header: 'Start Time',
      render: (c: IConsultationDtoForAdmin) =>
        format(new Date(c.startDateTime), 'dd MMM yyyy, hh:mm a'),
    },
    {
      header: 'End Time',
      render: (c: IConsultationDtoForAdmin) =>
        format(new Date(c.endDateTime), 'dd MMM yyyy, hh:mm a'),
    },
    {
      header: 'Session Goal',
      render: (c: IConsultationDtoForAdmin) => c.sessionGoal,
    },
    {
      header: 'Status',
      render: (c: IConsultationDtoForAdmin) => (
        <span
          className={`px-2 py-1 rounded-full text-white text-xs ${
            c.status === 'booked'
              ? 'bg-blue-600'
              : c.status === 'completed'
                ? 'bg-green-600'
                : c.status === 'cancelled'
                  ? 'bg-red-600'
                  : 'bg-yellow-500'
          }`}
        >
          {c.status}
        </span>
      ),
    },
    {
      header: 'Payment',
      render: (c: IConsultationDtoForAdmin) =>
        c.paymentStatus
          ? `${c.paymentStatus} (${c.paymentMethod ?? '-'})`
          : '-',
    },
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
        { label: 'All', value: 'all' },
        { label: 'Booked', value: 'booked' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Rescheduled', value: 'rescheduled' },
      ],
    },
    {
      type: 'select' as const,
      key: 'sort',
      placeholder: 'Sort by',
      options: [
        { label: 'Newest First', value: 'desc' },
        { label: 'Oldest First', value: 'asc' },
      ],
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Consultation Management
      </h2>

      <Filters
        config={filterConfig}
        values={filters}
        onChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        resetPage={() => setCurrentPage(1)}
      />

      <ReusableTable
        data={consultations}
        columns={columns}
        emptyMessage="No consultations found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ConsultationTable;
