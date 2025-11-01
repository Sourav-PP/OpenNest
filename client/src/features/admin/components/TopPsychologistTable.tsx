import { useCallback, useEffect, useState } from 'react';
import { type ITopPsychologistDto } from '@/types/dtos/psychologist';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import { handleApiError } from '@/lib/utils/handleApiError';
import { generalMessages } from '@/messages/GeneralMessages';
import Filters from '@/components/admin/Filters';
import { TopPsychologistFilter, type TopPsychologistFilterType } from '@/constants/types/SortFilter';
import type { Column } from '@/types/dtos/table';
import { getCloudinaryUrlSafe, imageColumn, textColumn } from '@/components/user/TableColumns';

const TopPsychologistTable = () => {
  const [topPsychologists, setTopPsychologists] = useState<ITopPsychologistDto[]>([]);
  const [sortBy, setSortBy] = useState<TopPsychologistFilterType>(TopPsychologistFilter.CONSULTATION);

  const fetchPsychologists = useCallback(async () => {
    try {
      const res = await adminApi.getTopPsychologists(20, sortBy);

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setTopPsychologists(res.data);
    } catch (error) {
      handleApiError(error);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchPsychologists();
  }, [fetchPsychologists]);

  const Verified = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#0a511d" />
      <path d="M8 12L11 15L16 9" stroke="#12f549" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const NotVerified = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#7f1d1d" />
      <path d="M9 9L15 15M15 9L9 15" stroke="#ff6c5d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // table columns
  const topPsychologistColumns: Column<ITopPsychologistDto>[] = [
    imageColumn<ITopPsychologistDto>('', p => getCloudinaryUrlSafe(p.profileImage), 'px-6 py-4'),

    textColumn<ITopPsychologistDto>('Name', p => p.name, 'px-6 py-4'),

    textColumn<ITopPsychologistDto>('Email', p => p.email, 'px-6 py-4'),

    textColumn<ITopPsychologistDto>('Qualification', p => p.qualification, 'px-6 py-4'),

    textColumn<ITopPsychologistDto>('Fee', p => `${p.defaultFee}$`, 'px-6 py-4'),

    textColumn<ITopPsychologistDto>('Total Consultations', p => `${p.totalConsultations}`, 'px-6 py-4'),

    {
      header: 'Average Rating',
      render: (p: ITopPsychologistDto) => (
        <div className="flex items-center gap-1">
          <span>{p.averageRating ?? 0}</span>
          <span className="text-yellow-400">⭐</span>
        </div>
      ),
      className: 'px-6 py-4',
    },

    textColumn<ITopPsychologistDto>('Total Reviews', p => `${p.totalReviews ?? 0}`, 'px-6 py-4'),

    {
      header: 'Is Verified',
      render: (p: ITopPsychologistDto) => (p.isVerified ? <Verified /> : <NotVerified />),
      className: 'px-6 py-4',
    },
  ];

  const filterConfig = [
    {
      type: 'select' as const,
      key: 'sortBy',
      placeholder: 'Sort by',
      options: [
        { label: 'Most Consulted', value: TopPsychologistFilter.CONSULTATION },
        { label: 'Highest Rated', value: TopPsychologistFilter.RATING },
        { label: 'Combined Score', value: TopPsychologistFilter.COMBINED },
      ],
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-white">Top 20 Psychologists</h2>
        <div className="w-full sm:w-auto">
          <Filters
            config={filterConfig}
            values={{ sortBy }}
            onChange={(key, value) => setSortBy(value as TopPsychologistFilterType)}
            resetPage={() => {}}
          />
        </div>
      </div>
      <ReusableTable
        data={topPsychologists}
        columns={topPsychologistColumns}
        emptyMessage="No users found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
    </div>
  );
};

export default TopPsychologistTable;
