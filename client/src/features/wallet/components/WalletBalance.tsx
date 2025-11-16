import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface Props {
  balance: number;
  currency: string;
  onAddFunds: () => void;
}

const WalletBalance: React.FC<Props> = ({ balance, currency, onAddFunds }) => {
  return (
    <Card className="shadow-lg rounded-2xl p-4">
      <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-0">
        {/* Left Section */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Wallet Balance</span>
          </div>

          <div className="text-2xl sm:text-3xl font-bold break-all">
            {currency} {balance.toFixed(2)}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full sm:w-auto">
          <Button
            onClick={onAddFunds}
            className="w-full sm:w-auto text-sm sm:text-base py-2"
          >
            Add Money
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
