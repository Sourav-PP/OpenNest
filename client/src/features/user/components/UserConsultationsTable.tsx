import { useEffect, useState } from 'react';
import type { IConsultationDto } from '@/types/dtos/consultation';
import { userApi } from '@/services/api/user';
import type { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import ConsultationFilters from '@/components/user/ConsultationFilters';
import ReusableTable from '@/components/user/ReusableTable';
import CustomPagination from '@/components/user/CustomPagination';
import AnimatedTitle from '@/components/animation/AnimatedTitle';

const UserConsultationsTable = () => {
  const [consultations, setConsultations] = useState<IConsultationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [status, setStatus] = useState<'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all'>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
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

        if(!res.data) {
          toast.error('Something went wrong');
          return;
        };

        setConsultations(res.data.consultations);
        setTotalCount(res.data.totalCount ?? 0);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        toast.error(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [currentPage, debouncedSearch, sort, status]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const columns = [
    {
      header: 'SI',
      render: (_: IConsultationDto, index: number) => index + 1,
      className: 'ps-4'
    },
    {
      header: 'Psychologist',
      render: (c: IConsultationDto) => c.psychologist.name,
    },
    {
      header: 'Start Date & Time',
      render: (c: IConsultationDto) => new Date(c.startDateTime).toLocaleString(),
    },
    {
      header: 'End Date & Time',
      render: (c: IConsultationDto) => new Date(c.endDateTime).toLocaleString(),
    },
    {
      header: 'Status',
      render: (c: IConsultationDto) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
            c.status === 'booked'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : c.status === 'cancelled'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : c.status === 'completed'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {c.status}
        </span>
      ),
    },
    {
      header: 'Meeting Link',
      render: (c: IConsultationDto) =>
        c.meetingLink ? (
          <a
            href={c.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            aria-label={`Join meeting for consultation ${c.id}`}
          >
            Join
          </a>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">N/A</span>
        ),
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
      <AnimatedTitle><h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-6 tracking-tight text-start">My Consultations</h2></AnimatedTitle>
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
          columns={columns}
          emptyMessage="No consultations found."
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default UserConsultationsTable;
