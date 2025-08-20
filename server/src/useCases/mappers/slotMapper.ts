import { User } from '@/domain/entities/user';
import { ISlotDto } from '../dtos/slot';
import { Slot } from '@/domain/entities/slot';

export function toSlotDto(slot: Slot, user: User | null): ISlotDto {
    return {
        id: slot.id.toString(),
        psychologistId: slot.psychologistId?.toString(),
        startDateTime: slot.startDateTime,
        endDateTime: slot.endDateTime,
        isBooked: slot.isBooked,
        bookedBy: user ? { name: user.name } : null,
    };
}