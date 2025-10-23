import { useCallback, useEffect, useState } from 'react';
import { type ITopPsychologistDto } from '@/types/dtos/psychologist';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import { handleApiError } from '@/lib/utils/handleApiError';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';
import { generalMessages } from '@/messages/GeneralMessages';
import Filters from '@/components/admin/Filters';
import { TopPsychologistFilter, type TopPsychologistFilterType } from '@/constants/types/SortFilter';

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
  const columns = [
    {
      header: '',
      render: (p: ITopPsychologistDto) => (
        <div className="flex justify-start min-w-[40px]">
          {p.profileImage ? (
            <img
              src={getCloudinaryUrl(p.profileImage) || undefined}
              alt={`${p.name}'s profile`}
              className="w-8 h-8 rounded-full object-cover border border-gray-600"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-800" />
          )}
        </div>
      ),
      className: 'px-6 py-4',
    },
    {
      header: 'Name',
      render: (p: ITopPsychologistDto) => p.name,
      className: 'px-6 py-4',
    },
    {
      header: 'Email',
      render: (p: ITopPsychologistDto) => p.email,
      className: 'px-6 py-4',
    },
    {
      header: 'Qualification',
      render: (p: ITopPsychologistDto) => `${p.qualification}`,
      className: 'px-6 py-4',
    },
    {
      header: 'Fee',
      render: (p: ITopPsychologistDto) => `${p.defaultFee}$`,
      className: 'px-6 py-4',
    },
    {
      header: 'Total Consultations',
      render: (p: ITopPsychologistDto) => `${p.totalConsultations} `,
      className: 'px-6 py-4',
    },
    { 
      header: 'Average Rating', 
      render: (p: ITopPsychologistDto) => (
        <div className="flex items-center gap-1">
          <span>{p.averageRating ?? 0}</span>
          <span className="text-yellow-400">⭐</span>
        </div>
      ), 
      className: 'px-6 py-4' 
    },
    { header: 'Total Reviews', render: (p: ITopPsychologistDto) => `${p.totalReviews ?? 0}`, className: 'px-6 py-4' },
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
        columns={columns}
        emptyMessage="No users found."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
    </div>
  );
};

export default TopPsychologistTable;