import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { psychologistApi } from '@/services/api/psychologist';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import ReusableTable from '@/components/user/ReusableTable';
import CustomPagination from '@/components/user/CustomPagination';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import type { IPatientConsultationHistoryDto } from '@/types/dtos/consultation';
import { formatDateOnly, formatTimeRange } from '@/lib/utils/dateTimeFormatter';
import { SortFilter, type SortFilterType } from '@/constants/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';
import { handleApiError } from '@/lib/utils/handleApiError';
import { ConsultationStatus } from '@/constants/Consultation';

const PatientHistoryTable = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [consultations, setConsultations] = useState<IPatientConsultationHistoryDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState<SortFilterType>(SortFilter.Desc);
  const [debouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { patientName } = location.state;
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        const res = await psychologistApi.getPatientHistory(patientId, {
          search: debouncedSearch,
          sort,
          page: currentPage,
          limit: itemsPerPage,
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
  }, [patientId, debouncedSearch, sort, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const columns = [
    { header: 'SI', render: (_: IPatientConsultationHistoryDto, i: number) => i + 1, className: 'ps-4' },
    { header: 'Date', render: (c: IPatientConsultationHistoryDto) => formatDateOnly(c.startDateTime) },
    {
      header: 'Time',
      render: (c: IPatientConsultationHistoryDto) => formatTimeRange(c.startDateTime, c.endDateTime).toLocaleString(),
    },
    { header: 'Goal', render: (c: IPatientConsultationHistoryDto) => c.sessionGoal },
    {
      header: 'Status',
      render: (c: IPatientConsultationHistoryDto) => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
            c.status === ConsultationStatus.Completed
              ? 'bg-blue-100 text-blue-800'
              : c.status === ConsultationStatus.Cancelled
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {c.status}
        </span>
      ),
    },
    {
      header: 'View',
      render: (c: IPatientConsultationHistoryDto) => (
        <Link
          to={`/psychologist/consultation/${c.id}/history`}
          state={{ from: 'patient-history', patientName: c.patient.name }}
          className="text-blue-600 hover:underline font-medium"
        >
          View
        </Link>
      ),
    },
  ];

  if (loading) {
    return <p className="text-center py-10">Loading history...</p>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <AnimatedTitle>
        <h2 className="text-3xl font-bold mb-6">Consultation History of {patientName.split(' ')[0]}</h2>
      </AnimatedTitle>
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortFilterType)}
          className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value={SortFilter.Desc}>Newest First</option>
          <option value={SortFilter.Asc}>Oldest First</option>
        </select>
      </div>
      <ReusableTable data={consultations} columns={columns} emptyMessage="No past consultations found." />
      <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default PatientHistoryTable;
