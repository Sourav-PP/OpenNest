import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import { handleApiError } from '@/lib/utils/handleApiError';
import { DialogTitle } from '@radix-ui/react-dialog';
import { PaymentPurpose } from '@/constants/types/Payment';
import { generalMessages } from '@/messages/GeneralMessages';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddFundsModal: React.FC<Props> = ({ open, onClose }: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) setAmount('');
  }, [open]);

  const handleAddFunds = async () => {
    const numericAmount = Number(amount);

    // ✅ Validate input
    if (!numericAmount || isNaN(numericAmount)) {
      toast.error('Please enter a valid amount.');
      return;
    }

    if (numericAmount <= 0) {
      toast.error('Amount must be greater than 0.');
      return;
    }

    if (numericAmount > 100000) {
      toast.error('Maximum allowed amount is 100,000.');
      return;
    }

    try {
      setLoading(true);

      const res = await userApi.createCheckoutSession({
        amount: numericAmount,
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
      <DialogContent className="w-[90%] sm:max-w-md p-4 sm:p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Add Funds
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            className="text-base sm:text-lg py-2"
          />
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddFunds}
            disabled={loading}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            {loading ? 'Processing...' : 'Add Funds'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  );
};

export default AddFundsModal;
