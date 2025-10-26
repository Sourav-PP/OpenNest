import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '@/services/api/admin';
import ReusableTable from '@/components/admin/ReusableTable';
import CustomPagination from '@/components/admin/CustomPagination';
import { handleApiError } from '@/lib/utils/handleApiError';
import Filters from '@/components/admin/Filters';
import type { PayoutRequestListItemDto } from '@/types/dtos/payoutRequest';
import { UserGenderFilter, type UserGenderFilterType } from '@/constants/types/User';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';
import { PayoutRequestStatus, PayoutRequestStatusColors } from '@/constants/types/PayoutRequest';
import type { Column } from '@/types/dtos/table';
import { getCloudinaryUrlSafe, imageColumn, textColumn } from '@/components/user/TableColumns';

const ITEM_PER_PAGE = 10;

const payoutRequestListColumns: Column<PayoutRequestListItemDto>[] = [
  imageColumn<PayoutRequestListItemDto>('Image', p => getCloudinaryUrlSafe(p.psychologist.profileImage), 'px-6 py-4'),

  textColumn<PayoutRequestListItemDto>('Psychologist', p => p.psychologist.name, 'px-6 py-4'),

  textColumn<PayoutRequestListItemDto>('Total Amount', p => `₹${p.requestedAmount}`, 'px-6 py-4'),

  textColumn<PayoutRequestListItemDto>('Commission', p => `₹${p.commissionAmount}`, 'px-6 py-4'),

  textColumn<PayoutRequestListItemDto>('Payout Amount', p => `₹${p.payoutAmount}`, 'px-6 py-4'),

  textColumn<PayoutRequestListItemDto>('Consultations', p => `${p.consultationIds.length}`, 'px-6 py-4'),

  {
    header: 'Status',
    render: (p: PayoutRequestListItemDto) => (
      <span className={`px-2 py-1 rounded-full text-xs ${PayoutRequestStatusColors[p.status]}`}>{p.status}</span>
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

const PayoutHistoryTable = () => {
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
  const [debouncedSearch, setDebouncedSearch] = useState('');

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
        limit: ITEM_PER_PAGE,
        search: debouncedSearch,
        sort: filters.sort,
      });

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }

      setPayouts(res.data.requests.filter(p => p.status !== PayoutRequestStatus.PENDING));
      setTotalCount(res.data.totalCount);
    } catch (error) {
      handleApiError(error);
    }
  }, [currentPage, debouncedSearch, filters.sort]);

  useEffect(() => {
    fetchPendingPayout();
  }, [fetchPendingPayout]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

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
        columns={payoutRequestListColumns}
        emptyMessage="No payout history."
        className="bg-admin-bg-secondary rounded-xl shadow-lg overflow-hidden"
      />
      <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default PayoutHistoryTable;
