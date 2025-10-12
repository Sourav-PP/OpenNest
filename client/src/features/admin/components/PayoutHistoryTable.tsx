import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { handleApiError } from '@/lib/utils/handleApiError';
import Filters from '@/components/admin/Filters';
import type { PayoutRequestListItemDto } from '@/types/dtos/payoutRequest';
import { getCloudinaryUrl } from '@/lib/utils/cloudinary';

const PayoutHistoryTable = () => {
  const [payouts, setPayouts] = useState<PayoutRequestListItemDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    gender: 'all',
    sort: 'desc',
  });
  const [selectedPayoutId, setSelectedPayoutId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const itemsPerPage = 10;

  // debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [filters.search]);

  const fetchPendingPayout = useCallback(async() => {
    try {
      const res = await adminApi.getPendingPayouts({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        sort: filters.sort as 'asc' | 'desc'
      });
      console.log('payout res: ', res);
      if(!res.data) {
        toast.error('something went wrong');
        return;
      }
  
      setPayouts(res.data.requests.filter((p) => p.status !== 'pending'));
      setTotalCount(res.data.totalCount);

    } catch (error) {
      handleApiError(error);
    }
  }, [currentPage, debouncedSearch, filters.sort]);

  useEffect(() => {
    fetchPendingPayout();
  }, [fetchPendingPayout]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const columns = [
    {
      header: 'Image',
      render: (p: PayoutRequestListItemDto) => (<div>
        {p.psychologist.profileImage ? (
          <img
            src={getCloudinaryUrl(p.psychologist.profileImage) || undefined}
            alt={`${p.psychologist.name}'s profile`}
            loading="lazy"
            className="w-8 h-8 rounded-full object-cover border border-gray-600"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-800" />
        )}
      </div>),
      className: 'px-6 py-4'
    },
    { header: 'Psychologist', render: (p: PayoutRequestListItemDto) => p.psychologist.name, className: 'px-6 py-4' },
    { header: 'Total Amount', render: (p: PayoutRequestListItemDto) => `₹${p.requestedAmount}`, className: 'px-6 py-4' },
    { header: 'Commission', render: (p: PayoutRequestListItemDto) => `₹${p.commissionAmount}`, className: 'px-6 py-4' },
    { header: 'Payout Amount', render: (p: PayoutRequestListItemDto) => `₹${p.payoutAmount}`, className: 'px-6 py-4' },
    { header: 'Consultations', render: (p: PayoutRequestListItemDto) => p.consultationIds.length, className: 'px-6 py-4' },
    {
      header: 'Status',
      render: (p: PayoutRequestListItemDto) => (
        <span
          className={`px-2 py-1 rounded-full text-white text-xs ${
            p.status === 'approved'
              ? 'bg-green-900/60 text-green-400'
              : 'bg-red-900/60 text-red-400'
          }`}
        >
          {p.status}
        </span>
      ),
    },
  ];

  const payoutFilterConfig = [
    {
      type: 'search' as const,
      key: 'search',
      placeholder: 'Search by name or email',
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
    <div className="px-4 sm:px-6 lg:px-8 py-8 mb-10">
      <h2 className="text-2xl font-semibold text-white mb-6">Pending Payouts</h2>
      <Filters
        config={payoutFilterConfig}
        values={filters}
        onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        resetPage={() => setCurrentPage(1)}
      />
      <ReusableTable
        data={payouts}
        columns={columns}
        emptyMessage="No payout history."
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

export default PayoutHistoryTable;
