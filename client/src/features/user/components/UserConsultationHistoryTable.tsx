import { useEffect, useState } from 'react';
import type { IConsultationDto } from '@/types/dtos/consultation';
import { userApi } from '@/services/api/user';
import { toast } from 'react-toastify';
import ReusableTable from '@/components/user/ReusableTable';
import CustomPagination from '@/components/user/CustomPagination';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { Link, useNavigate } from 'react-router-dom';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';

const UserConsultationHistoryTable = () => {
  const [consultations, setConsultations] = useState<IConsultationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortFilterType>(SortFilter.Desc);
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
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await userApi.getUserConsultationHistory({
          search: debouncedSearch,
          sort: sort,
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

    fetchHistory();
  }, [debouncedSearch, sort, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const columns = [
    {
      header: 'SI',
      render: (_: IConsultationDto, index: number) => index + 1 + (currentPage - 1) * itemsPerPage,
      className: 'ps-4',
    },
    {
      header: 'Psychologist',
      render: (c: IConsultationDto) => (
        <div className="flex items-center gap-2">
          {c.psychologist.profileImage && (
            <img
              src={getCloudinaryUrl(c.psychologist.profileImage) || undefined}
              alt={c.psychologist.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{c.psychologist.name}</span>
        </div>
      ),
    },
    {
      header: 'Session Goal',
      render: (c: IConsultationDto) => <span className="line-clamp-1">{c.sessionGoal}</span>,
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
      header: 'View',
      render: (c: IConsultationDto) => (
        <Link
          to={userFrontendRoutes.consultationHistoryDetail(c.id)}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View
        </Link>
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
      <AnimatedTitle>
        <h2 className="text-3xl sm:text-4xl font-bold text-primaryText mb-6 tracking-tight text-start">
          Consultation History
        </h2>
      </AnimatedTitle>

      <div className="space-y-6 dark:bg-gray-800 rounded-lg">
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by psychologist or goal..."
            className="px-3 py-2 border rounded-lg w-full sm:w-1/2"
          />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 border rounded-lg"
          >
            <option value={SortFilter.Desc}>Newest First</option>
            <option value={SortFilter.Asc}>Oldest First</option>
          </select>
        </div>

        <ReusableTable
          data={consultations}
          columns={columns}
          onRowClick={(c: IConsultationDto) => navigate(userFrontendRoutes.consultationHistoryDetail(c.id))}
          emptyMessage="No consultation history found."
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        />

        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default UserConsultationHistoryTable;
