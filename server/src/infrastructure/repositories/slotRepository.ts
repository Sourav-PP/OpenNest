import { ISlotRepository } from '../../domain/interfaces/ISlotRepository';
import { Slot } from '../../domain/entities/slot';
import { SlotModel } from '../database/models/psychologist/slotModel';
import { Types } from 'mongoose';
import { ISlotDto } from '../../domain/dtos/slot';

export class SlotRepository implements ISlotRepository {
    async createSlot(slots: Slot[]): Promise<void> {
        await SlotModel.insertMany(slots);
    }

    async checkConflict(psychologistId: string, start: Date, end: Date): Promise<boolean> {
        const conflict = await SlotModel.findOne({
            psychologistId,
            $or: [
                { stardDateTime: { $lt: end }, endDateTime: { $gt: start } },
            ],
        });

        return conflict !== null;
    }

    async getSlotByPsychologistId(psychologistId: string): Promise<Slot[]> {
        const slots = await SlotModel.find({ psychologistId }).lean();
        return slots.map((slot) => ({
            ...slot,
            id: slot._id.toString(),
            psychologistId: slot.psychologistId.toString(),
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

    async getSlotByPsychologist(psychologistId: string, date: Date): Promise<ISlotDto[]> {
        const matchStage: Record<string, unknown> = { psychologistId: new Types.ObjectId(psychologistId) };

        if (date) {
            const startOfDayUTC = new Date(date); // 2025-08-10T18:30:00.000Z
            const endOfDayUTC = new Date(startOfDayUTC.getTime() + 24 * 60 * 60 * 1000); // +24 hours
    
            matchStage.startDateTime = {
                $gte: startOfDayUTC,
                $lte: endOfDayUTC,
            };
        }

        const slots = await SlotModel.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'bookedBy',
                    foreignField: '_id',
                    as: 'bookedByUser',
                },
            },
            {
                $project: {
                    id: { $toString: '$_id' },
                    psychologistId: { $toString: '$psychologistId' },
                    startDateTime: 1,
                    endDateTime: 1,
                    isBooked: 1,
                    bookedBy: {
                        $cond: [
                            { $ifNull: ['$bookedByUser', false] },
                            { name: '$bookedByUser.name' },
                            null,
                        ],
                    },
                },
            },
        ]);

        return slots;
    }
}