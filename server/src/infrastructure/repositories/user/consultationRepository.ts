import mongoose, { PipelineStage } from 'mongoose';
import { Consultation } from '@/domain/entities/consultation';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { ConsultationModel } from '@/infrastructure/database/models/user/Consultation';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';
import { Message } from '@/domain/entities/message';
import { Slot } from '@/domain/entities/slot';
import { Payment } from '@/domain/entities/payment';

export class ConsultationRepository implements IConsultationRepository {
    async createConsultation(
        data: Omit<Consultation, 'id'>,
    ): Promise<Consultation> {
        const createdConsultation = await ConsultationModel.create(data);
        const consultationObj = createdConsultation.toObject();

        return {
            ...consultationObj,
            patientId: consultationObj.patientId.toString(),
            psychologistId: consultationObj.psychologistId.toString(),
            subscriptionId: consultationObj.subscriptionId?.toString(),
            slotId: consultationObj.slotId.toString(),
            id: consultationObj._id.toString(),
        };
    }

    async isSlotBooked(slotId: string): Promise<boolean> {
        const existing = await ConsultationModel.findOne({
            slotId,
            status: 'booked',
        });

        return existing ? true : false;
    }

    async findByPsychologistId(
        psychologistId: string,
        params: {
            search?: string;
            sort?: 'asc' | 'desc';
            skip?: number;
            limit?: number;
            status:
                | 'booked'
                | 'cancelled'
                | 'completed'
                | 'rescheduled'
                | 'all';
        },
    ): Promise<{ consultation: Consultation; patient: User; payment?: Payment; lastMessage?: Message; lastMessageTime?: Date; unreadCount: number }[]> {
        const matchStage: Record<string, unknown> = {
            psychologistId: new mongoose.Types.ObjectId(psychologistId),
        };

        if (params.status && params.status !== 'all') {
            matchStage.status = params.status;
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const pipeline: PipelineStage[] = [
            { $match: matchStage },

            {
                $lookup: {
                    from: 'users',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient',
                },
            },
            { $unwind: '$patient' },
            {
                $lookup: {
                    from: 'payments',
                    localField: '_id',
                    foreignField: 'consultationId', 
                    as: 'payment',
                },
            },
            { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'messages',
                    let: { consultationId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$consultationId', '$$consultationId'] },
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                    ],
                    as: 'lastMessage',
                },
            },
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
                    lastMessageTime: { $arrayElemAt: ['$lastMessage.createdAt', 0] },
                },
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { consultationId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$consultationId', '$$consultationId'] },
                                status: { $in: ['sent', 'delivered'] },
                                receiverId: new mongoose.Types.ObjectId(psychologistId),
                            },
                        },
                        { $count: 'unreadCount' },
                    ],
                    as: 'unread',
                },
            },
            {
                $addFields: {
                    unreadCount: {
                        $ifNull: [{ $arrayElemAt: ['$unread.unreadCount', 0] }, 0],
                    },
                },
            },
        ];

        if (params.search) {
            pipeline.push({
                $match: {
                    'patient.name': { $regex: params.search, $options: 'i' },
                },
            });
        }

        pipeline.push({ $sort: { startDateTime: sortOrder } });

        if (typeof params.skip === 'number' && params.skip > 0) {
            pipeline.push({ $skip: params.skip });
        }

        if (typeof params.limit === 'number' && params.limit > 0) {
            pipeline.push({ $limit: params.limit });
        }

        const results = await ConsultationModel.aggregate(pipeline);

        return results.map(item => ({
            consultation: {
                id: item._id.toString(),
                patientId: item.patientId.toString(),
                startDateTime: item.startDateTime,
                endDateTime: item.endDateTime,
                sessionGoal: item.sessionGoal,
                status: item.status,
                meetingLink: item.meetingLink,
                psychologistId: item.psychologistId.toString(),
            } as Consultation,
            payment: item.payment
                ? {
                    id: item.payment._id.toString(),
                    userId: item.payment.userId.toString(),
                    consultationId: item.payment.consultationId?.toString(),
                    amount: item.payment.amount,
                    currency: item.payment.currency,
                    paymentMethod: item.payment.paymentMethod,
                    paymentStatus: item.payment.paymentStatus,
                    refunded: item.payment.refunded,
                    transactionId: item.payment.transactionId,
                    stripeSessionId: item.payment.stripeSessionId,
                    slotId: item.payment.slotId?.toString() ?? null,
                    purpose: item.payment.purpose,
                } as Payment
                : undefined,
            patient: {
                id: item.patient._id.toString(),
                name: item.patient.name,
                profileImage: item.patient.profileImage,
            } as User,
            lastMessage: item.lastMessage ?? undefined,
            lastMessageTime: item.lastMessageTime ?? undefined,
            unreadCount: item.unreadCount ?? 0,
        }));
    }

    async findByPatientId(
        patientId: string,
        params: {
            search?: string;
            sort?: 'asc' | 'desc';
            skip?: number;
            limit?: number;
            status:
                | 'booked'
                | 'cancelled'
                | 'completed'
                | 'rescheduled'
                | 'all';
        },
    ): Promise<
        { consultation: Consultation; psychologist: Psychologist; user: User; lastMessage?: Message;
        lastMessageTime?: Date;
        unreadCount: number; }[]
    > {
        const matchStage: Record<string, unknown> = {
            patientId: new mongoose.Types.ObjectId(patientId),
        };

        if (params.status && params.status !== 'all') {
            matchStage.status = params.status;
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const pipeline: PipelineStage[] = [
            { $match: matchStage },

            {
                $lookup: {
                    from: 'psychologists',
                    localField: 'psychologistId',
                    foreignField: '_id',
                    as: 'psychologist',
                },
            },
            { $unwind: '$psychologist' },

            {
                $lookup: {
                    from: 'users',
                    localField: 'psychologist.userId',
                    foreignField: '_id',
                    as: 'psychologist.user',
                },
            },
            { $unwind: '$psychologist.user' },
            {
                $lookup: {
                    from: 'messages',
                    let: { consultationId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        '$consultationId',
                                        '$$consultationId',
                                    ],
                                },
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                    ],
                    as: 'lastMessage',
                },
            },
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
                    lastMessageTime: {
                        $arrayElemAt: ['$lastMessage.createdAt', 0],
                    },
                },
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { consultationId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [
                                        '$consultationId',
                                        '$$consultationId',
                                    ],
                                },
                                status: { $in: ['sent', 'delivered'] },
                                receiverId: new mongoose.Types.ObjectId(
                                    patientId,
                                ),
                            },
                        },
                        { $count: 'unreadCount' },
                    ],
                    as: 'unread',
                },
            },
            {
                $addFields: {
                    unreadCount: {
                        $ifNull: [{ $arrayElemAt: ['$unread.unreadCount', 0] }, 0],
                    },
                },
            },
        ];

        if (params.search) {
            pipeline.push({
                $match: {
                    'psychologist.user.name': {
                        $regex: params.search,
                        $options: 'i',
                    },
                },
            });
        }

        pipeline.push({ $sort: { startDateTime: sortOrder } });

        if (typeof params.skip === 'number' && params.skip > 0) {
            pipeline.push({ $skip: params.skip });
        }

        if (typeof params.limit === 'number' && params.limit > 0) {
            pipeline.push({ $limit: params.limit });
        }

        const results = await ConsultationModel.aggregate(pipeline);

        return results.map(item => ({
            consultation: {
                id: item._id.toString(),
                patientId: item.patientId.toString(),
                startDateTime: item.startDateTime,
                endDateTime: item.endDateTime,
                sessionGoal: item.sessionGoal,
                status: item.status,
                meetingLink: item.meetingLink,
                psychologistId: item.psychologist._id.toString(),
            } as Consultation,
            psychologist: {
                id: item.psychologist._id.toString(),
                userId: item.psychologist.userId.toString(),
            } as Psychologist,
            user: { // user collection of psychologist
                id: item.psychologist.user._id.toString(),
                name: item.psychologist.user.name,
                profileImage: item.psychologist.user.profileImage,
            } as User,
            lastMessage: item.lastMessage ?? undefined,
            lastMessageTime: item.lastMessageTime ?? undefined,
            unreadCount: item.unreadCount ?? 0,
        }));
    }

    async findById(id: string): Promise<Consultation | null> {
        const consultation = await ConsultationModel.findById(id);
        if (!consultation) return null;

        const consultationObj = consultation.toObject();
        return {
            ...consultationObj,
            patientId: consultationObj.patientId.toString(),
            psychologistId: consultationObj.psychologistId.toString(),
            subscriptionId: consultationObj.subscriptionId?.toString(),
            slotId: consultationObj.slotId.toString(),
            id: consultationObj._id.toString(),
        };
    }

    async findByPatientAndPsychologistId(patientId: string, psychologistId: string): Promise<Consultation[]> {
        const consultations = await ConsultationModel.find({ patientId, psychologistId });

        return consultations.map(consultation => ({
            ...consultation.toObject(),
            patientId: consultation.patientId.toString(),
            psychologistId: consultation.psychologistId.toString(),
            subscriptionId: consultation.subscriptionId?.toString(),
            slotId: consultation.slotId.toString(),
            id: consultation._id.toString(),
        }));
    }
    async update(consultation: Consultation): Promise<Consultation | null> {
        const updated = await ConsultationModel.findByIdAndUpdate(
            consultation.id,
            {
                $set: {
                    patientId: consultation.patientId,
                    psychologistId: consultation.psychologistId,
                    subscriptionId: consultation.subscriptionId,
                    slotId: consultation.slotId,
                    startDateTime: consultation.startDateTime,
                    endDateTime: consultation.endDateTime,
                    sessionGoal: consultation.sessionGoal,
                    status: consultation.status,
                    paymentStatus: consultation.paymentStatus,
                    paymentMethod: consultation.paymentMethod,
                    paymentIntentId: consultation.paymentIntentId,
                    cancellationReason: consultation.cancellationReason,
                    cancelledAt: consultation.cancelledAt,
                    includedInPayout: consultation.includedInPayout,
                    meetingLink: consultation.meetingLink,
                },
            },
            { new: true },
        ).lean();

        if (!updated) {
            return null;
        }

        return {
            id: updated._id.toString(),
            patientId: updated.patientId.toString(),
            psychologistId: updated.psychologistId.toString(),
            subscriptionId: updated.subscriptionId?.toString(),
            slotId: updated.slotId.toString(),
            startDateTime: updated.startDateTime,
            endDateTime: updated.endDateTime,
            sessionGoal: updated.sessionGoal,
            status: updated.status,
            paymentStatus: updated.paymentStatus,
            paymentMethod: updated.paymentMethod,
            paymentIntentId: updated.paymentIntentId,
            cancellationReason: updated.cancellationReason,
            cancelledAt: updated.cancelledAt,
            includedInPayout: updated.includedInPayout,
            meetingLink: updated.meetingLink,
        };
    }
    
    async updateConsultation(id: string, update: Partial<Consultation>): Promise<Consultation | null> {
        const updated = await ConsultationModel.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true },
        ).lean();

        if (!updated) return null;

        return {
            id: updated._id.toString(),
            patientId: updated.patientId.toString(),
            psychologistId: updated.psychologistId.toString(),
            subscriptionId: updated.subscriptionId?.toString(),
            slotId: updated.slotId.toString(),
            startDateTime: updated.startDateTime,
            endDateTime: updated.endDateTime,
            sessionGoal: updated.sessionGoal,
            status: updated.status,
            paymentStatus: updated.paymentStatus,
            paymentMethod: updated.paymentMethod,
            paymentIntentId: updated.paymentIntentId,
            cancellationReason: updated.cancellationReason,
            cancelledAt: updated.cancelledAt,
            includedInPayout: updated.includedInPayout,
            meetingLink: updated.meetingLink, 
        };
    }

    async findByIdWithDetails(id: string): Promise<{ consultation: Consultation; psychologist: Psychologist & User; user: User; slot: Slot; payment: Payment } | null> {
        const pipeline: PipelineStage[] = [
            { $match: { _id: new mongoose.Types.ObjectId(id) } },

            {
                $lookup: {
                    from: 'psychologists',
                    localField: 'psychologistId',
                    foreignField: '_id',
                    as: 'psychologist',
                },
            },
            { $unwind: '$psychologist' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'psychologist.userId',
                    foreignField: '_id',
                    as: 'psychologist.user',
                },
            },
            { $unwind: '$psychologist.user' },

            {
                $lookup: {
                    from: 'users',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient',
                },
            },
            { $unwind: '$patient' },

            {
                $lookup: {
                    from: 'slots',
                    localField: 'slotId',
                    foreignField: '_id',
                    as: 'slot',
                },
            },
            { $unwind: '$slot' },
            {
                $lookup: {
                    from: 'payments',
                    localField: '_id',
                    foreignField: 'consultationId',
                    as: 'payment',
                },
            },
            { $unwind: '$payment' },
        ];

        const result = await ConsultationModel.aggregate(pipeline);

        if (!result || result.length === 0) return null;
        const item = result[0];

        return {
            consultation: {
                id: item._id.toString(),
                patientId: item.patientId.toString(),
                startDateTime: item.startDateTime,
                endDateTime: item.endDateTime,
                sessionGoal: item.sessionGoal,
                status: item.status,
                meetingLink: item.meetingLink,
                psychologistId: item.psychologist._id.toString(),
                slotId: item.slot._id.toString(),
            } as Consultation,
            psychologist: {
                id: item.psychologist._id.toString(),
                userId: item.psychologist.userId.toString(),
                name: item.psychologist.user.name,
                profileImage: item.psychologist.user.profileImage,
            } as Psychologist & User, 
            user: {
                id: item.patient._id.toString(),
                name: item.patient.name,
                profileImage: item.patient.profileImage,
            } as User,
            slot: {
                id: item.slot._id.toString(),
                psychologistId: item.slot.psychologistId.toString(),
                startDateTime: item.slot.startDateTime,
                endDateTime: item.slot.endDateTime,
                isBooked: item.slot.isBooked ?? false,
                bookedBy: item.slot.bookedBy ? item.slot.bookedBy.toString() : null,
            } as Slot,
            payment: {
                id: item.payment._id.toString(),
                userId: item.payment.userId.toString(),
                consultationId: item.payment.consultationId?.toString(),
                amount: item.payment.amount,
                currency: item.payment.currency,
                paymentMethod: item.payment.paymentMethod,
                paymentStatus: item.payment.paymentStatus,
                refunded: item.payment.refunded,
                transactionId: item.payment.transactionId,
                stripeSessionId: item.payment.stripeSessionId,
                slotId: item.payment.slotId?.toString() ?? null,
                purpose: item.payment.purpose,
            } as Payment,
        };

    }

    async countAllByPatientId(patientId: string): Promise<number> {
        return await ConsultationModel.countDocuments({ patientId });
    }

    async countAllByPsychologistId(psychologistId: string): Promise<number> {
        return await ConsultationModel.countDocuments({ psychologistId });
    }

    async findAll(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        skip?: number;
        limit?: number;
        status?:
            | 'booked'
            | 'cancelled'
            | 'completed'
            | 'rescheduled'
            | 'all';
    }): Promise<{ consultation: Consultation; psychologist: Psychologist & User; patient: User; payment?: Payment;}[]> {
        const matchStage: Record<string, unknown> = {};
        if (params.status && params.status !== 'all') {
            matchStage.status = params.status;
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const pipeline: PipelineStage[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient',
                },
            },
            { $unwind: '$patient' },

            {
                $lookup: {
                    from: 'psychologists',
                    localField: 'psychologistId',
                    foreignField: '_id',
                    as: 'psychologist',
                },
            },
            { $unwind: '$psychologist' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'psychologist.userId',
                    foreignField: '_id',
                    as: 'psychologist.user',
                },
            },
            { $unwind: '$psychologist.user' },

            {
                $lookup: {
                    from: 'payments',
                    localField: '_id',
                    foreignField: 'consultationId',
                    as: 'payment',
                },
            },
            { $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
        ];

        if (params.search) {
            pipeline.push({
                $match: {
                    $or: [
                        { 'patient.name': { $regex: params.search, $options: 'i' } },
                        { 'psychologist.user.name': { $regex: params.search, $options: 'i' } },
                        { sessionGoal: { $regex: params.search, $options: 'i' } },
                    ],
                },
            });
        }

        pipeline.push({ $sort: { startDateTime: sortOrder } });

        if (typeof params.skip === 'number' && params.skip > 0) {
            pipeline.push({ $skip: params.skip });
        }

        if (typeof params.limit === 'number' && params.limit > 0) {
            pipeline.push({ $limit: params.limit });
        }

        const results = await ConsultationModel.aggregate(pipeline);

        return results.map(item => ({
            consultation: {
                id: item._id.toString(),
                patientId: item.patientId.toString(),
                psychologistId: item.psychologistId.toString(),
                slotId: item.slotId.toString(),
                subscriptionId: item.subscriptionId?.toString(),
                startDateTime: item.startDateTime,
                endDateTime: item.endDateTime,
                sessionGoal: item.sessionGoal,
                status: item.status,
                paymentStatus: item.paymentStatus,
                paymentMethod: item.paymentMethod,
                paymentIntentId: item.paymentIntentId,
                cancellationReason: item.cancellationReason,
                cancelledAt: item.cancelledAt,
                includedInPayout: item.includedInPayout,
                meetingLink: item.meetingLink,
            } as Consultation,
            patient: {
                id: item.patient._id.toString(),
                name: item.patient.name,
                profileImage: item.patient.profileImage,
            } as User,
            psychologist: {
                id: item.psychologist._id.toString(),
                userId: item.psychologist.userId.toString(),
                name: item.psychologist.user.name,
                profileImage: item.psychologist.user.profileImage,
            } as Psychologist & User,
            payment: item.payment
                ? {
                    id: item.payment._id.toString(),
                    userId: item.payment.userId.toString(),
                    consultationId: item.payment.consultationId?.toString(),
                    amount: item.payment.amount,
                    currency: item.payment.currency,
                    paymentMethod: item.payment.paymentMethod,
                    paymentStatus: item.payment.paymentStatus,
                    refunded: item.payment.refunded,
                    transactionId: item.payment.transactionId,
                    stripeSessionId: item.payment.stripeSessionId,
                    slotId: item.payment.slotId?.toString() ?? null,
                    purpose: item.payment.purpose,
                }
                : undefined,
        }));
    }

    async countAll(params: { search?: string; status?: 'booked' | 'cancelled' | 'completed' | 'rescheduled' | 'all' }): Promise<number> {
        const matchStage: Record<string, unknown> = {};
        if (params.status && params.status !== 'all') {
            matchStage.status = params.status;
        }

        const pipeline: PipelineStage[] = [{ $match: matchStage }];

        if (params.search) {
            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient',
                },
            });
            pipeline.push({ $unwind: '$patient' });

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'psychologistId',
                    foreignField: '_id',
                    as: 'psychologistUser',
                },
            });
            pipeline.push({ $unwind: '$psychologistUser' });

            pipeline.push({
                $match: {
                    $or: [
                        { 'patient.name': { $regex: params.search, $options: 'i' } },
                        { 'psychologistUser.name': { $regex: params.search, $options: 'i' } },
                    ],
                },
            });
        }

        pipeline.push({ $count: 'total' });

        const result = await ConsultationModel.aggregate<{ total: number }>(pipeline);

        return result.length > 0 ? result[0].total : 0;
    }
}
