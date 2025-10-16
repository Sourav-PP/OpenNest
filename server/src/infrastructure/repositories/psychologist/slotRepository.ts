import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { Slot } from '@/domain/entities/slot';
import { SlotModel, ISlotDocument } from '@/infrastructure/database/models/psychologist/slotModel';
import mongoose, { PipelineStage, Types } from 'mongoose';
import { User } from '@/domain/entities/user';
import { GenericRepository } from '../GenericRepository';

export class SlotRepository extends GenericRepository<Slot, ISlotDocument> implements ISlotRepository {
    constructor() {
        super(SlotModel);
    }
    async createSlot(slots: Omit<Slot, 'id' | 'isBooked' | 'isAvailable'>[]): Promise<void> {
        await SlotModel.insertMany(slots);
    }

    protected map(doc: ISlotDocument): Slot {
        const mapped = super.map(doc); 
        
        return {
            id: mapped.id,
            psychologistId: mapped.psychologistId as string,
            startDateTime: mapped.startDateTime,
            endDateTime: mapped.endDateTime,
            isAvailable: mapped.isAvailable,
            isBooked: mapped.isBooked,
            bookedBy: mapped.bookedBy as string | null, 
        };
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
        const slots = await SlotModel.aggregate([

            { $match: { psychologistId: new mongoose.Types.ObjectId(psychologistId) } },

            {
                $lookup: {
                    from: 'users', 
                    localField: 'bookedBy',
                    foreignField: '_id',
                    as: 'bookedByUser',
                },
            },

            { $unwind: { path: '$bookedByUser', preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1,
                    psychologistId: 1,
                    startDateTime: 1,
                    endDateTime: 1,
                    isAvailable: 1,
                    isBooked: 1,
                    bookedBy: {
                        $cond: [
                            { $ifNull: ['$bookedByUser', false] },
                            {
                                id: { $toString: '$bookedByUser._id' },
                                name: '$bookedByUser.name',
                                email: '$bookedByUser.email',
                                phone: '$bookedByUser.phone',
                            },
                            null,
                        ],
                    },
                },
            },
        ]);

        return slots.map((slot) => ({
            ...slot,
            id: slot._id.toString(),
            _id: undefined,
        }));
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

    async markSlotAsAvailable(slotId: string): Promise<void> {
        await SlotModel.findByIdAndUpdate(
            slotId,
            { isBooked: false, bookedBy: null },
            { new: true },
        );
    }   

    async markSlotAsNotAvailable(slotId: string): Promise<void> {
        await SlotModel.findByIdAndUpdate(
            slotId,
            { 
                isBooked: false,      
                isAvailable: false,  
                bookedBy: null,
            },
            { new: true },
        );
    }

    async getSlotByPsychologist(psychologistId: string, date: Date): Promise<{slot: Slot, user: User | null}[]> {
        const matchStage: Record<string, unknown> = { psychologistId: new Types.ObjectId(psychologistId) };
        if (date) {
            const startOfDayUTC = new Date(date); // frontend sends date as midnight
            const endOfDayUTC = new Date(startOfDayUTC.getTime() + 24 * 60 * 60 * 1000);
    
            matchStage.startDateTime = {
                $gte: startOfDayUTC,
                $lte: endOfDayUTC,
            };
        }

        const pipeline: PipelineStage[] = [
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
                isAvailable: item.isAvailable,
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