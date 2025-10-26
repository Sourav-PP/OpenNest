import { useEffect, useState } from 'react';
import type { IConsultationDto } from '@/types/dtos/consultation';
import { userApi } from '@/services/api/user';
import { toast } from 'react-toastify';
import ConsultationFilters from '@/components/user/ConsultationFilters';
import ReusableTable from '@/components/user/ReusableTable';
import CustomPagination from '@/components/user/CustomPagination';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { Link, useNavigate } from 'react-router-dom';
import { handleApiError } from '@/lib/utils/handleApiError';
import {
  ConsultationStatus,
  ConsultationStatusFilter,
  type ConsultationStatusFilterType,
} from '@/constants/types/Consultation';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';
import type { Column } from '@/types/dtos/table';
import { textColumn } from '@/components/user/TableColumns';

const UserConsultationsTable = () => {
  const [consultations, setConsultations] = useState<IConsultationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortFilterType>(SortFilter.Asc);
  const [status, setStatus] = useState<ConsultationStatusFilterType>(ConsultationStatusFilter.All);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const res = await userApi.getUserConsultations({
          search: debouncedSearch,
          sort: sort,
          status: status,
          limit: itemsPerPage,
          page: currentPage,
        });

        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        setConsultations(res.data.consultations);
        setTotalCount(res.data.totalCount ?? 0);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [currentPage, debouncedSearch, sort, status]);

  const formatDateTime = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium', // e.g. Sep 8, 2025
      timeStyle: 'short', // e.g. 2:30 PM
    }).format(new Date(date));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const userConsultationColumns: Column<IConsultationDto>[] = [
    {
      header: 'SI',
      render: (_: IConsultationDto, index: number) => index + 1,
      className: 'ps-4',
    },

    textColumn<IConsultationDto>('Psychologist', c => c.psychologist.name, 'px-6 py-4'),

    textColumn<IConsultationDto>('Start Date & Time', c => formatDateTime(c.startDateTime), 'px-6 py-4'),

    textColumn<IConsultationDto>('End Date & Time', c => formatDateTime(c.endDateTime), 'px-6 py-4'),

    {
      header: 'Status',
      render: c => {
        const statusClasses = {
          [ConsultationStatus.Booked]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          [ConsultationStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          [ConsultationStatus.Completed]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          [ConsultationStatus.Missed]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          [ConsultationStatus.Rescheduled]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        return (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClasses[c.status!] || ''}`}
          >
            {c.status}
          </span>
        );
      },
      className: 'px-6 py-4',
    },

    {
      header: 'View',
      render: c => (
        <Link
          to={userFrontendRoutes.consultationDetail(c.id)}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View
        </Link>
      ),
      className: 'px-6 py-4',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="relative h-10 w-10 animate-spin" style={{ animationDuration: '1.2s' }}>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="absolute h-2 w-2 bg-gray-300 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${index * 45}deg) translateY(-18px)`,
              }}
            ></div>
          ))}
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-br from-slate-200 to-white min-h-screen">
      <AnimatedTitle>
        <h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-6 tracking-tight text-start">
          My Consultations
        </h2>
      </AnimatedTitle>
      <div className="space-y-6 dark:bg-gray-800 rounded-lg">
        <ConsultationFilters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          status={status}
          setStatus={setStatus}
          setCurrentPage={setCurrentPage}
        />
        <ReusableTable
          data={consultations}
          columns={userConsultationColumns}
          onRowClick={(consultation: IConsultationDto) => {
            navigate(userFrontendRoutes.consultationDetail(consultation.id));
          }}
          emptyMessage="No consultations found."
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        />
        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default UserConsultationsTable;
