import { useEffect, useState } from 'react';
import type { IConsultationDto } from '@/types/dtos/consultation';
import { userApi } from '@/services/api/user';
import { toast } from 'react-toastify';
import ConsultationFilters from '@/components/user/ConsultationFilters';
import ReusableTable from '@/components/user/ReusableTable';
import CustomPagination from '@/components/user/CustomPagination';
import AnimatedTitle from '@/components/animation/AnimatedTitle';
import { Link, useNavigate } from 'react-router-dom';
import { handleApiError } from '@/lib/utils/handleApiError';
import {
  ConsultationStatus,
  ConsultationStatusFilter,
  type ConsultationStatusFilterType,
} from '@/constants/types/Consultation';
import { SortFilter, type SortFilterType } from '@/constants/types/SortFilter';
import { generalMessages } from '@/messages/GeneralMessages';
import { userFrontendRoutes } from '@/constants/frontendRoutes/userFrontendRoutes';
import type { Column } from '@/types/dtos/table';
import { textColumn } from '@/components/user/TableColumns';
import type { ITransactionDto } from '@/types/dtos/user';
import { PaymentStatus } from '@/constants/types/Payment';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<ITransactionDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await userApi.getUserTransactions({
          page: currentPage,
          limit: itemsPerPage,
        });
        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        setTransactions(res.data.transactions);
        setTotalCount(res.data.totalCount ?? 0);
      } catch (err) {
        handleApiError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

  const formatDateTime = (date: string | Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium', // e.g. Sep 8, 2025
      timeStyle: 'short', // e.g. 2:30 PM
    }).format(new Date(date));
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const userTransactionsColumns: Column<ITransactionDto>[] = [
    {
      header: 'SI',
      render: (_: ITransactionDto, index: number) => index + 1,
      className: 'ps-4',
    },

    textColumn<ITransactionDto>('Date', c => formatDateTime(c.createdAt), 'px-6 py-4'),

    textColumn<ITransactionDto>('Purpose', c => c.purpose, 'px-6 py-4'),

    textColumn<ITransactionDto>('Amount', c => c.amount.toString() + '$', 'px-6 py-4'),

    textColumn<ITransactionDto>('Method', c => c.paymentMethod, 'px-6 py-4'),

    {
      header: 'Status',
      render: c => {
        const statusClasses = {
          [PaymentStatus.SUCCEEDED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          [PaymentStatus.FAILED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          [PaymentStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        };
        return (
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClasses[c.paymentStatus] || ''}`}
          >
            {c.paymentStatus}
          </span>
        );
      },
      className: 'px-6 py-4',
    },

    textColumn<ITransactionDto>('Transaction ID', c => c.transactionId ?? '', 'px-6 py-4'),
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
          My Consultations
        </h2>
      </AnimatedTitle>
      <div className="space-y-6 dark:bg-gray-800 rounded-lg">
        <ReusableTable
          data={transactions}
          columns={userTransactionsColumns}
          emptyMessage="No Transactions found."
          emptyDescription='Try adjusting filters!'
          className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        />
        <CustomPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default TransactionHistory;
