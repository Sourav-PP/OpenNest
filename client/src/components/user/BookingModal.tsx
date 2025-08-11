import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { userApi } from '@/server/api/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";

interface BookingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  slotId: string | null;
  amount: number
  onSuccess: () => void; 
}

interface FormData {
  sessionGoal: string;
  paymentMethod: 'stripe' | 'wallet';
}

const BookingModal: React.FC<BookingModalProps> = ({isOpen, onOpenChange, slotId, amount, onSuccess}) => {

  // const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting}
  } = useForm<FormData>({
    defaultValues: {
      paymentMethod: 'stripe',
      sessionGoal: ''
    }
  })

  const onSubmit = async(data: FormData) => {
    if(!slotId) return

    try {
      const response = await userApi.createCheckoutSession({
        slotId,
        amount,
        sessionGoal: data.sessionGoal
      })

      console.log("re: ", response)

      window.location.href = response.url

      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.log('error booking: ', error)
       toast.error( "Booking failed");
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Book Session</DialogTitle>
          <DialogDescription>
            Fill the details and select a payment method to book this slot.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div>
            <label htmlFor="sessionGoal" className="block font-medium text-gray-700">
              Session Goal
            </label>
            <textarea
              id="sessionGoal"
              {...register("sessionGoal", { required: "Session goal is required" })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.sessionGoal && (
              <p className="mt-1 text-sm text-red-600">{errors.sessionGoal.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Payment Method</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="stripe"
                  {...register("paymentMethod", { required: true })}
                  defaultChecked
                  className="form-radio text-blue-600"
                />
                <span>Credit Card (Stripe)</span>
              </label>

              <label className="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="wallet"
                  {...register("paymentMethod", { required: true })}
                  className="form-radio text-blue-600"
                />
                <span>Wallet</span>
              </label>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <button
              type="button"
              className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {isSubmitting ? "Booking..." : `Pay ₹${amount}`}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default BookingModal
