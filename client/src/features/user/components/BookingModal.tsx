import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { handleApiError } from '@/lib/utils/handleApiError';
import { useEffect, useState } from 'react';
import { ConsultationPaymentMethod, type ConsultationPaymentMethodType } from '@/constants/types/Consultation';
import { generalMessages } from '@/messages/GeneralMessages';
import { PaymentPurpose } from '@/constants/types/Payment';

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slotId: string | null;
  amount: number;
  onSuccess: () => void;
}

interface FormData {
  sessionGoal: string;
  paymentMethod: ConsultationPaymentMethodType;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onOpenChange, slotId, amount, onSuccess }) => {
  // const [loading, setLoading] = useState(false)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [loadingSub, setLoadingSub] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      paymentMethod: ConsultationPaymentMethod.STRIPE,
      sessionGoal: '',
    },
  });

  useEffect(() => {
    const fetchActiveSubscription = async () => {
      try {
        setLoadingSub(true);
        const res = await userApi.getActiveSubscription();
        if (res.data) {
          setSubscriptionId(res.data.id);
        } else {
          setSubscriptionId(null);
        }
      } catch (error) {
        handleApiError(error);
        setSubscriptionId(null);
      } finally {
        setLoadingSub(false);
      }
    };
    if (isOpen) {
      fetchActiveSubscription();
    }
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    if (!slotId) return;

    try {
      if (data.paymentMethod === ConsultationPaymentMethod.SUBSCRIPTION) {
        if (!subscriptionId) {
          toast.error('No active subscription found. Please select another payment method.');
          return;
        }

        const res = await userApi.bookConsultationWithSubscription({
          subscriptionId,
          slotId,
          sessionGoal: data.sessionGoal,
        });

        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        if (res.success) {
          toast.success('Booking confirmed using subscription!');
          reset();
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(res.message || 'Something went wrong');
        }
        return;
      }

      if (data.paymentMethod === ConsultationPaymentMethod.STRIPE) {
        const res = await userApi.createCheckoutSession({
          slotId,
          amount,
          sessionGoal: data.sessionGoal,
          purpose: PaymentPurpose.CONSULTATION,
        });

        if (!res.data) {
          toast.error(generalMessages.ERROR.INTERNAL_SERVER_ERROR);
          return;
        }

        window.location.href = res.data.url;

        reset();
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl bg-white p-8 shadow-xl border border-gray-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Book Your Session</DialogTitle>
          <DialogDescription className="text-gray-600 text-sm mt-2">
            Please provide the session details and choose a payment method to confirm your booking.
          </DialogDescription>
        </DialogHeader>
        {loadingSub ? (
          <div className="py-12 text-center text-gray-500 animate-pulse">Loading subscription information...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div>
              <label htmlFor="sessionGoal" className="block text-sm font-semibold text-gray-800">
                Session Goal
              </label>
              <textarea
                id="sessionGoal"
                {...register('sessionGoal', { required: 'Session goal is required' })}
                rows={4}
                className="mt-2 block w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="What would you like to achieve in this session?"
              />
              {errors.sessionGoal && <p className="mt-1 text-xs text-red-500">{errors.sessionGoal.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Payment Method</label>
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200">
                  <input
                    type="radio"
                    value={ConsultationPaymentMethod.STRIPE}
                    {...register('paymentMethod', { required: true })}
                    defaultChecked
                    className="form-radio text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="text-gray-700 font-medium">Credit Card (Stripe)</span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200">
                  <input
                    type="radio"
                    value={ConsultationPaymentMethod.WALLET}
                    {...register('paymentMethod', { required: true })}
                    className="form-radio text-blue-600 focus:ring-blue-500 h-5 w-5"
                  />
                  <span className="text-gray-700 font-medium">Wallet</span>
                </label>

                {subscriptionId && (
                  <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-200">
                    <input
                      type="radio"
                      value={ConsultationPaymentMethod.SUBSCRIPTION}
                      {...register('paymentMethod', { required: true })}
                      className="form-radio text-blue-600 focus:ring-blue-500 h-5 w-5"
                    />
                    <span className="text-gray-700 font-medium">Use Subscription Credit</span>
                  </label>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 transition duration-200"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
              >
                {isSubmitting ? 'Processing...' : subscriptionId ? 'Confirm Booking' : `Pay ₹${amount}`}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
