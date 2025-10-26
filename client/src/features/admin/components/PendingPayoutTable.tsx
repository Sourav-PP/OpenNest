import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { handleApiError } from '@/lib/utils/handleApiError';
import Filters from '@/components/admin/Filters';
import type { PayoutRequestListItemDto } from '@/types/dtos/payoutRequest';
import { UserGenderFilter, type UserGenderFilterType } from '@/constants/types/User';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';
import { PayoutRequestStatus } from '@/constants/types/PayoutRequest';
import type { Column } from '@/types/dtos/table';
import { textColumn } from '@/components/user/TableColumns';

const PendingPayoutTable = () => {
  const [payouts, setPayouts] = useState<PayoutRequestListItemDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{
    search: string;
    gender: UserGenderFilterType;
    sort: SortFilterType;
  }>({
    search: '',
    gender: UserGenderFilter.ALL,
    sort: SortFilter.Desc,
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

  const fetchPendingPayout = useCallback(async () => {
    try {
      const res = await adminApi.getPendingPayouts({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch,
        sort: filters.sort,
      });

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setPayouts(res.data.requests.filter(p => p.status === PayoutRequestStatus.PENDING));
      setTotalCount(res.data.totalCount);
    } catch (error) {
      handleApiError(error);
    }
  }, [currentPage, debouncedSearch, filters.sort]);

  useEffect(() => {
    fetchPendingPayout();
  }, [fetchPendingPayout]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleActionClick = (payoutId: string, type: 'approve' | 'reject') => {
    setSelectedPayoutId(payoutId);
    setActionType(type);
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedPayoutId || !actionType) return;
    try {
      if (actionType === 'approve') {
        const res = await adminApi.approvePayout(selectedPayoutId);
        toast.success(res.message);
      } else {
        const res = await adminApi.rejectPayout(selectedPayoutId);
        toast.success(res.message);
      }
      setModalOpen(false);
      fetchPendingPayout();
    } catch (err) {
      handleApiError(err);
    }
  };

  const payoutRequestColumns: Column<PayoutRequestListItemDto>[] = [
    textColumn<PayoutRequestListItemDto>('Psychologist', p => p.psychologist.name, 'px-6 py-4'),

    textColumn<PayoutRequestListItemDto>('Total Amount', p => `₹${p.requestedAmount}`, 'px-6 py-4'),

    textColumn<PayoutRequestListItemDto>('Commission', p => `₹${p.commissionAmount}`, 'px-6 py-4'),

    textColumn<PayoutRequestListItemDto>('Payout Amount', p => `₹${p.payoutAmount}`, 'px-6 py-4'),

    textColumn<PayoutRequestListItemDto>('Consultations', p => `${p.consultationIds.length}`, 'px-6 py-4'),

    {
      header: 'Action',
      render: (p: PayoutRequestListItemDto) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleActionClick(p.id, 'approve')}
            className="px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleActionClick(p.id, 'reject')}
            className="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      ),
      className: 'px-6 py-4',
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
        { label: 'Newest First', value: SortFilter.Desc },
        { label: 'Oldest First', value: SortFilter.Asc },
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
        columns={payoutRequestColumns}
        emptyMessage="No pending payout requests."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
        message={`Are you sure you want to ${actionType === 'approve' ? 'approve' : 'reject'} this payout?`}
      />
    </div>
  );
};

export default PendingPayoutTable;
