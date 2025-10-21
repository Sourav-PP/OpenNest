import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { psychologistApi } from '@/services/api/psychologist';
import { handleApiError } from '@/lib/utils/handleApiError';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ConsultationNotesModalProps {
  consultationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (notes: { privateNotes?: string; feedback?: string }) => void;
  initialNotes?: { privateNotes?: string; feedback?: string };
}

const NotesSchema = z.object({
  privateNotes: z
    .string()
    .trim()
    .min(5, 'Private notes should be at least 5 characters.')
    .max(1000, 'Private notes cannot exceed 1000 characters.'),
  feedback: z
    .string()
    .trim()
    .min(5, 'Feedback should be at least 5 characters.')
    .max(1000, 'Feedback cannot exceed 1000 characters.'),
});

type NotesFormValues = z.infer<typeof NotesSchema>;

export default function ConsultationNotesModal({
  consultationId,
  isOpen,
  onClose,
  onSaved,
  initialNotes,
}: ConsultationNotesModalProps) {

  const form = useForm<NotesFormValues>({
    resolver: zodResolver(NotesSchema),
    defaultValues: {
      privateNotes: initialNotes?.privateNotes || '',
      feedback: initialNotes?.feedback || '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset({
      privateNotes: initialNotes?.privateNotes || '',
      feedback: initialNotes?.feedback || '',
    });
  }, [initialNotes, form, isOpen]);

  const onSubmit = async (values: NotesFormValues) => {
    try {
      const res = await psychologistApi.updateConsultationNotes(consultationId, values);
      if (res?.success) {
        toast.success('Consultation notes and feedback saved successfully.');
        onSaved(values);
        onClose();
      } else {
        toast.error('Failed to save notes.');
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Consultation Notes & Feedback</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="privateNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Private Notes (only you)</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback to Patient</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Notes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
