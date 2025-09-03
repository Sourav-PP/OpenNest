import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

interface Props {
  balance: number;
  currency: string;
  onAddFunds: () => void;
}

const WalletBalance: React.FC<Props> = ({balance, currency, onAddFunds}) => {
  return (
    <Card className="shadow-lg rounded-2xl p-4 flex justify-between items-center">
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Wallet /> Wallet Balance
        </div>
        <div className="text-3xl font-bold">
          {currency} {balance.toFixed(2)}
        </div>
      </CardContent>
      <Button onClick={onAddFunds}>Add Money</Button>
    </Card>
  );
};

export default WalletBalance;