import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import { handleApiError } from '@/lib/utils/handleApiError';
import { DialogTitle } from '@radix-ui/react-dialog';
import { PaymentPurpose } from '@/constants/Payment';
import { generalMessages } from '@/messages/GeneralMessages';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddFundsModal: React.FC<Props> = ({ open, onClose }: Props) => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAddFunds = async () => {
    if (!amount || amount <= 0 || amount > 10000) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      setLoading(true);

      const res = await userApi.createCheckoutSession({
        amount,
        purpose: PaymentPurpose.WALLET,
      });

      if (!res.data) {
        toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
        return;
      }
      window.location.href = res.data.url;
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddFunds} disabled={loading}>
            {loading ? 'Processing...' : 'Add Funds'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFundsModal;
