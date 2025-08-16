import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { Slot } from '@/domain/entities/slot';
import { SlotModel } from '@/infrastructure/database/models/psychologist/slotModel';
import { Types } from 'mongoose';
import { User } from '@/domain/entities/user';

export class SlotRepository implements ISlotRepository {
    async createSlot(slots: Omit<Slot, 'id' | 'isBooked'>[]): Promise<void> {
        await SlotModel.insertMany(slots);
    }

    async checkConflict(psychologistId: string, start: Date, end: Date): Promise<boolean> {
        const conflict = await SlotModel.findOne({
            psychologistId,
            $or: [
                { startDateTime: { $lt: end }, endDateTime: { $gt: start } },
            ],
        });

        return conflict !== null;
    }

    async getAllSlotsByPsychologistId(psychologistId: string): Promise<Slot[]> {
        const slots = await SlotModel.find({ psychologistId }).lean();
        return slots.map((slot) => ({
            id: slot._id.toString(),
            psychologistId: slot.psychologistId.toString(),
            startDateTime: slot.startDateTime,
            endDateTime: slot.endDateTime,
            isBooked: slot.isBooked,
            bookedBy: slot.bookedBy?.toString() ?? null,
        }));
    }

    async findById(id: string): Promise<Slot | null> {
        const slot = await SlotModel.findById(id).lean();
        if (!slot) return null;

        return {
            ...slot,
            id: slot?._id.toString(),
            psychologistId: slot.psychologistId.toString(),
            bookedBy: slot.bookedBy?.toString() ?? null,
        };
    }

    async deleteById(id: string): Promise<void> {
        await SlotModel.findByIdAndDelete(id);
    }

    async markSlotAsBooked(slotId: string, patientId: string): Promise<void> {
        await SlotModel.findByIdAndUpdate(
            slotId,
            {
                isBooked: true,
                bookedBy: patientId,
            },
            { new: true },
        );
    }

    async getSlotByPsychologist(psychologistId: string, date: Date): Promise<{slot: Slot, user: User | null}[]> {
        const matchStage: Record<string, unknown> = { psychologistId: new Types.ObjectId(psychologistId) };

        if (date) {
            const startOfDayUTC = new Date(date); // 2025-08-10T18:30:00.000Z
            const endOfDayUTC = new Date(startOfDayUTC.getTime() + 24 * 60 * 60 * 1000); // +24 hours
    
            matchStage.startDateTime = {
                $gte: startOfDayUTC,
                $lte: endOfDayUTC,
            };
        }

        const pipeline: any[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'bookedBy',
                    foreignField: '_id',
                    as: 'bookedByUser',
                },
            },
            { $unwind: { path: '$bookedByUser', preserveNullAndEmptyArrays: true } },
            { $sort: { startDateTime: 1 } },
        ];

        const results = await SlotModel.aggregate(pipeline);

        return results.map(item => ({
            slot: {
                id: item._id.toString(),
                psychologistId: item.psychologistId.toString(),
                startDateTime: item.startDateTime,
                endDateTime: item.endDateTime,
                isBooked: item.isBooked,
                bookedBy: item.bookedByUser ? item.bookedByUser._id.toString() : null,
            },
            user: item.bookedByUser ? {
                id: item.bookedByUser._id.toString(),
                name: item.bookedByUser.name,
            } as User : null,
        }));
    }
}