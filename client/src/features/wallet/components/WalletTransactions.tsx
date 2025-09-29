import { Card, CardContent } from '@/components/ui/card';
import type { IWalletTransaction } from '@/types/dtos/wallet';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import CustomPagination from '@/components/user/CustomPagination';

interface Props {
  transactions: IWalletTransaction[];
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const WalletTransactions: React.FC<Props> = ({ transactions, itemsPerPage, currentPage, onPageChange, totalCount, loading }) => {
  console.log('transactions', transactions);
  const totalPage = Math.ceil(totalCount / itemsPerPage);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <Card className="mt-6 shadow rounded-2xl">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="py-4 flex justify-between items-center"
              >
                {/* Left side: Icon + Details */}
                <div className="flex items-start gap-3">
                  {tx.type === 'credit' ? (
                    <ArrowDownCircle className="text-green-500 w-7 h-7 mt-1" />
                  ) : (
                    <ArrowUpCircle className="text-red-500 w-7 h-7 mt-1" />
                  )}

                  <div>
                    {/* Reason */}
                    <p className="text-sm font-medium text-gray-900">
                      {tx.metadata?.reason || 'Wallet transaction'}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate((tx as any).createdAt)}
                    </p>

                    {/* Status
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        tx.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : tx.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tx.status}
                    </span> */}
                  </div>
                </div>

                {/* Right side: Amount */}
                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalPage > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WalletTransactions;
