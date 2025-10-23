import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { userApi } from '@/services/api/user';
import { handleApiError } from '@/lib/utils/handleApiError';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  rating: z
    .number({
      required_error: 'Please select a rating before submitting.',
      invalid_type_error: 'Rating must be a number between 1 and 5.',
    })
    .min(1, { message: 'Please select at least one star.' })
    .max(5, { message: 'Invalid rating value.' }),
  userFeedback: z
    .string()
    .max(300, { message: 'Feedback must be under 300 characters.' })
    .optional(),
});

interface Props {
  consultationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ConsultationRatingModal({ consultationId, isOpen, onClose, onSubmitted }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      userFeedback: '',
    },
  });

  const rating = watch('rating', 0);

  const handleCancel = () => {
    reset(); // ✅ Reset all fields when canceled
    onClose();
  };


  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const res = await userApi.submitConsultationRating(consultationId, data);
      toast.success(res.message || 'Feedback submitted!');
      onSubmitted();
      onClose();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rate Your Consultation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setValue('rating', star)}
                className={`text-3xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-500 text-sm text-center">{errors.rating.message}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your feedback (optional)</label>
            <Textarea
              {...register('userFeedback')}
              rows={3}
              placeholder="Share your experience..."
              className="w-full"
            />
            {errors.userFeedback && <p className="text-red-500 text-sm mt-1">{errors.userFeedback.message}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
