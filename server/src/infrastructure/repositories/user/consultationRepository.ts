import mongoose, { PipelineStage } from 'mongoose';
import { Consultation } from '@/domain/entities/consultation';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { ConsultationModel } from '@/infrastructure/database/models/user/Consultation';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';
import { Message } from '@/domain/entities/message';

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
            issue: consultationObj.issue?.map(i => i.toString()),
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
    ): Promise<{ consultation: Consultation; patient: User; lastMessage?: Message; lastMessageTime?: Date; unreadCount: number }[]> {
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
            issue: consultationObj.issue?.map(i => i.toString()),
            id: consultationObj._id.toString(),
        };
    }

    async countAllByPatientId(patientId: string): Promise<number> {
        return await ConsultationModel.countDocuments({ patientId });
    }

    async countAllByPsychologistId(psychologistId: string): Promise<number> {
        return await ConsultationModel.countDocuments({ psychologistId });
    }
}
