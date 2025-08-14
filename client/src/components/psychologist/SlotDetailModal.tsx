import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import type { ISlotDto } from '@/types/slot';
import { ConfirmationDialog } from './ConfirmationDialog';

interface SlotDetailModalProps {
    open: boolean;
    onClose: () => void;
    slot: ISlotDto | null
    onDelete: () => void;
}


const SlotDetailModal: React.FC<SlotDetailModalProps> = ({open, onClose, slot, onDelete}) => {

  if(!slot) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-lg">Slot Details</DialogTitle>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Status:</strong> {slot.isBooked ? 'Booked' : 'Available'}</p>
            <p>
              <strong>Start:</strong> {new Date(slot.startDateTime).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {new Date(slot.endDateTime).toLocaleString()}
            </p>
            {slot.isBooked && slot.bookedBy && (
              <p>
                <strong>Booked By:</strong> {slot.bookedBy}
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <ConfirmationDialog
              trigger={<Button variant="destructive">Delete Slot</Button>}
              title="Are you sure you want to delete this slot?"
              description="This will permanently remove the slot from the system."
              confirmLabel="Yes, Delete"
              cancelLabel="No, Cancel"
              onConfirm={onDelete}
            />
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SlotDetailModal;
