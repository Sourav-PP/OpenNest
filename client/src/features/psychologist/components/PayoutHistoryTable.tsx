import { useEffect, useState } from 'react';
import { psychologistApi } from '@/services/api/psychologist';
import { toast } from 'react-toastify';
import ReusableTable from '@/components/user/ReusableTable';
import CustomPagination from '@/components/user/CustomPagination';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { formatDateOnly } from '@/lib/utils/dateTimeFormatter';
import { handleApiError } from '@/lib/utils/handleApiError';
import type { IPayoutRequestDto } from '@/types/dtos/payoutRequest';
import { PayoutRequestStatus } from '@/constants/types/PayoutRequest';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { textColumn } from '@/components/user/TableColumns';
import type { Column } from '@/types/dtos/table';

const PayoutHistoryTable = () => {
  const [payouts, setPayouts] = useState<IPayoutRequestDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState<SortFilterType>(SortFilter.Desc);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  useEffect(() => {
    const fetchPayoutHistory = async () => {
      try {
        setLoading(true);
        const res = await psychologistApi.getPayoutHistory({
          sort,
          page: currentPage,
          limit: itemsPerPage,
        });

        if (!res.data) {
          toast.error('Failed to load payout history');
          return;
        }

        setPayouts(res.data.requests);
        setTotalCount(res.data.totalCount ?? 0);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutHistory();
  }, [sort, currentPage]);

  const payoutRequestColumns: Column<IPayoutRequestDto>[] = [
    {
      header: 'SI',
      render: (_: IPayoutRequestDto, i: number) => i + 1 + (currentPage - 1) * itemsPerPage,
      className: 'ps-4',
    },

    textColumn<IPayoutRequestDto>(
      'Date',
      p => formatDateOnly(p.createdAt),
      'px-6 py-4'
    ),

    textColumn<IPayoutRequestDto>(
      'Total Amount',
      p => `₹${p.requestedAmount}`,
      'px-6 py-4 text-right'
    ),

    textColumn<IPayoutRequestDto>(
      'Commission',
      p => `₹${p.commissionAmount}`,
      'px-6 py-4 text-right'
    ),

    textColumn<IPayoutRequestDto>(
      'Payout Amount',
      p => `₹${p.payoutAmount}`,
      'px-6 py-4 text-right font-semibold'
    ),

    textColumn<IPayoutRequestDto>(
      'Consultations',
      p => p.consultationIds.length.toString(),
      'px-6 py-4 text-center'
    ),

    {
      header: 'Status',
      render: p => (
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
            p.status === PayoutRequestStatus.APPROVED
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : p.status === PayoutRequestStatus.PENDING
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {p.status}
        </span>
      ),
      className: 'px-6 py-4 text-center',
    },
  ];

  if (loading) {
    return <p className="text-center py-10">Loading payout history...</p>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-100">
      <AnimatedTitle>
        <h2 className="text-2xl font-bold mb-3 text-left">Payout History</h2>
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
      <ReusableTable data={payouts} columns={payoutRequestColumns} emptyMessage="No payout history found." />
      <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default PayoutHistoryTable;
