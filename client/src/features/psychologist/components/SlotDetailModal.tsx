import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ISlotDto } from '@/types/dtos/slot';
import { ConfirmationDialog } from '@/components/psychologist/ConfirmationDialog';
import { format } from 'date-fns';

interface SlotDetailModalProps {
    open: boolean;
    onClose: () => void;
    slot: ISlotDto | null
    onDelete: () => void;
}


const SlotDetailModal: React.FC<SlotDetailModalProps> = ({open, onClose, slot, onDelete}) => {

  console.log('slot: ',slot);
  if(!slot) return null;

  const start = new Date(slot.startDateTime);
  const end = new Date(slot.endDateTime);
  const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

  const formattedStart = format(start, "EEEE, dd MMM yyyy 'at' hh:mm a");
  const formattedEnd = format(end, "EEEE, dd MMM yyyy 'at' hh:mm a");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Slot Details</DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-4 text-gray-700 text-sm">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                slot.isBooked ? 'bg-red-600' : 'bg-green-600'
              }`}
            >
              {slot.isBooked ? 'Booked' : 'Available'}
            </span>
          </div>

          {/* Timing Details (stacked vertically) */}
          <div className="space-y-2">
            <div>
              <p className="text-gray-500 text-xs">Start Time</p>
              <p className="font-medium">{formattedStart}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">End Time</p>
              <p className="font-medium">{formattedEnd}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Duration</p>
              <p className="font-medium">{durationMinutes} minutes</p>
            </div>
          </div>

          {/* Booked Info */}
          {slot.isBooked && slot.bookedBy && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium mb-1">Booked By</p>
              <p>
                <span className="font-medium">Name:</span> {slot.bookedBy.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {slot.bookedBy.email}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="pt-6 flex justify-end space-x-2">
          <ConfirmationDialog
            trigger={<Button variant="destructive">Delete Slot</Button>}
            title="Are you sure you want to delete this slot?"
            description="This will permanently remove the slot from the system and cannot be undone."
            confirmLabel="Yes, Delete"
            cancelLabel="No, Cancel"
            onConfirm={onDelete}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlotDetailModal;
