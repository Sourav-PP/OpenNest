import { Card, CardContent } from '@/components/ui/card';
import type { IWalletTransaction } from '@/types/dtos/wallet';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface Props {
  transactions: IWalletTransaction[];
}

const WalletTransactions: React.FC<Props> = ({ transactions }) => {
  return (
    <Card className="mt-6 shadow rounded-2xl">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="divide-y">
            {transactions.map(tx => (
              <li key={tx.id} className="flex justify-between py-3 items-center">
                <div className="flex items-center gap-2">
                  {tx.type === 'credit' ? (
                    <ArrowDownCircle className="text-green-500" />
                  ) : (
                    <ArrowUpCircle className="text-red-500" />
                  )}
                  <span className="capitalize">{tx.type}</span>
                </div>
                <div>
                  <span
                    className={`font-semibold ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletTransactions;
