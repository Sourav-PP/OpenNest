import { useEffect, useState } from 'react';
import type { IPsychologistConsultationDto } from '@/types/dtos/consultation';
import { toast } from 'react-toastify';
import ReusableTable from '@/components/user/ReusableTable';
import CustomPagination from '@/components/user/CustomPagination';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { Link } from 'react-router-dom';
import { handleApiError } from '@/lib/utils/handleApiError';
import { psychologistApi } from '@/services/api/psychologist';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';
import { psychologistFrontendRoutes } from '@/constants/frontendRoutes/psychologistFrontendRoutes';
import type { Column } from '@/types/dtos/table';
import { getCloudinaryUrlSafe, imageColumn, textColumn } from '@/components/user/TableColumns';
import { formatDateTime } from '@/lib/utils/dateTimeFormatter';

const PsychologistConsultationHistoryTable = () => {
  const [consultations, setConsultations] = useState<IPsychologistConsultationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortFilterType>(SortFilter.Desc);
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
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await psychologistApi.getPsychologistConsultationHistory({
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

  const psychologistConsultationColumns: Column<IPsychologistConsultationDto>[] = [

    imageColumn<IPsychologistConsultationDto>(
      'Image',
      c => getCloudinaryUrlSafe(c.patient.profileImage),
      'px-6 py-4'
    ),

    textColumn<IPsychologistConsultationDto>(
      'Name',
      c => c.patient.name.split(' ')[0],
      'px-6 py-4'
    ),

    textColumn<IPsychologistConsultationDto>(
      'Session Goal',
      c => c.sessionGoal,
      'px-6 py-4'
    ),

    textColumn<IPsychologistConsultationDto>(
      'Start Date & Time',
      c => formatDateTime(c.startDateTime),
      'px-6 py-4'
    ),

    textColumn<IPsychologistConsultationDto>(
      'End Date & Time',
      c => formatDateTime(c.endDateTime),
      'px-6 py-4'
    ),

    {
      header: 'View',
      render: c => (
        <Link
          to={psychologistFrontendRoutes.consultationHistoryDetail(c.id)}
          state={{ from: 'consultation-history', patientName: c.patient.name }}
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
          columns={psychologistConsultationColumns}
          emptyMessage="No consultation history found."
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        />

        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default PsychologistConsultationHistoryTable;
