import { Psychologist } from '@/domain/entities/psychologist';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IServiceDocument, ServiceModel } from '@/infrastructure/database/models/admin/serviceModel';
import {
    PsychologistModel,
    IPsychologistDocument,
} from '@/infrastructure/database/models/psychologist/PsychologistModel';
import { User } from '@/domain/entities/user';
import mongoose, { PipelineStage, Types } from 'mongoose';
import { GenericRepository } from '../GenericRepository';
import { ConsultationModel } from '@/infrastructure/database/models/user/Consultation';
import { UserGender, UserGenderFilter, UserRole } from '@/domain/enums/UserEnums';
import { ConsultationPaymentStatus, ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { RevenueFilter, SortFilter, TopPsychologistSortFilter } from '@/domain/enums/SortFilterEnum';
import { IPsychologistBookingTrend, IUniqueClientTrend } from '@/useCases/dtos/user';

export class PsychologistRepository
    extends GenericRepository<Psychologist, IPsychologistDocument>
    implements IPsychologistRepository
{
    constructor() {
        super(PsychologistModel);
    }

    protected map(doc: IPsychologistDocument): Psychologist {
        const mapped = super.map(doc);

        return {
            id: mapped.id,
            userId: mapped.userId as string,
            aboutMe: mapped.aboutMe,
            qualification: mapped.qualification,
            specializations: (mapped.specializations as (string | Types.ObjectId)[]).map(id => id.toString()),
            defaultFee: mapped.defaultFee,
            isVerified: mapped.isVerified,
            specializationFees: mapped.specializationFees.map(fee => ({
                specializationId: fee.specializationId.toString(),
                specializationName: fee.specializationName,
                fee: fee.fee,
            })),
            averageRating: mapped.averageRating,
            totalReviews: mapped.totalReviews,
        };
    }

    async findAllPsychologists(params: {
        search?: string;
        sort?: SortFilter;
        gender?: UserGenderFilter;
        expertise?: string;
        skip: number;
        limit: number;
    }): Promise<{ psychologist: Psychologist; user: User }[]> {
        const matchStage: Record<string, unknown> = {
            'user.role': UserRole.PSYCHOLOGIST,
        };

        if (params.search) {
            matchStage['user.name'] = { $regex: params.search, $options: 'i' };
        }

        if (params.gender && params.gender !== 'all') {
            matchStage['user.gender'] = params.gender;
        }

        const sortOrder = params.sort === SortFilter.ASC ? 1 : -1;

        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'services',
                    localField: 'specializations',
                    foreignField: '_id',
                    as: 'specializationData',
                },
            },
            { $match: matchStage },
        ];

        if (params.expertise) {
            pipeline.push({
                $match: {
                    'specializationData.name': {
                        $regex: params.expertise,
                        $options: 'i',
                    },
                },
            });
        }

        pipeline.push({ $sort: { createdAt: sortOrder } }, { $skip: params.skip }, { $limit: params.limit });

        const results = await PsychologistModel.aggregate(pipeline);

        return results.map(item => ({
            psychologist: {
                id: item._id.toString(),
                userId: item.userId.toString(),
                aboutMe: item.aboutMe,
                qualification: item.qualification,
                defaultFee: item.defaultFee,
                isVerified: item.isVerified,
                specializations: item.specializationData.map((s: IServiceDocument) => s.name),
                specializationFees: item.specializationFees || [],
                averageRating: item.averageRating,
                totalReviews: item.totalReviews,
            } as Psychologist,
            user: {
                id: item.user._id.toString(),
                name: item.user.name,
                email: item.user.email,
                phone: item.user.phone,
                isActive: item.user.isActive,
                profileImage: item.user.profileImage,
            } as User,
        }));
    }

    async countAllPsychologist(params?: { search?: string; gender?: UserGender }): Promise<number> {
        const matchStage: Record<string, unknown> = {
            'user.role': UserRole.PSYCHOLOGIST,
        };

        if (params && params.search) {
            matchStage['user.name'] = { $regex: params.search, $options: 'i' };
        }

        if (params && params.gender) {
            matchStage['user.gender'] = params.gender;
        }

        const result = await PsychologistModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $match: matchStage },
            { $count: 'total' },
        ]);

        return result[0]?.total || 0;
    }

    async countAllVerified(): Promise<number> {
        return await PsychologistModel.countDocuments({ isVerified: true });
    }

    async updateByUserId(userId: string, updateData: Partial<Psychologist>): Promise<Psychologist | null> {
        const doc = await PsychologistModel.findOneAndUpdate({ userId }, { $set: updateData }, { new: true });
        if (!doc) return null;
        return this.map(doc);
    }

    async findByUserId(userId: string): Promise<Psychologist | null> {
        const doc = await PsychologistModel.findOne({ userId });
        if (!doc) return null;

        return this.map(doc);
    }

    async getSpecializationNamesByIds(ids: string[]): Promise<string[]> {
        const specializations = await ServiceModel.find({
            _id: { $in: ids },
        }).select('name');
        return specializations.map(s => s.name);
    }

    async findTopPsychologists(
        limit: number,
        sortBy: TopPsychologistSortFilter = TopPsychologistSortFilter.COMBINED,
    ): Promise<
        {
            psychologist: Psychologist;
            user: User;
            totalConsultations: number;
            averageRating?: number;
            totalReviews?: number;
        }[]
    > {
        const topPsychologists = await ConsultationModel.aggregate([
            { $match: { paymentStatus: ConsultationPaymentStatus.PAID, status: ConsultationStatus.COMPLETED } },

            {
                $group: {
                    _id: '$psychologistId',
                    totalConsultations: { $sum: 1 },
                },
            },

            { $sort: { totalConsultations: -1 } },

            {
                $lookup: {
                    from: 'psychologists',
                    localField: '_id',
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
                    as: 'user',
                },
            },
            { $unwind: '$user' },

            {
                $lookup: {
                    from: 'services',
                    localField: 'psychologist.specializations',
                    foreignField: '_id',
                    as: 'specializationData',
                },
            },
            {
                $addFields: {
                    combinedScore: {
                        $add: [
                            { $multiply: ['$totalConsultations', 0.6] },
                            { $multiply: ['$psychologist.averageRating', 0.4] },
                        ],
                    },
                },
            },
            {
                $sort:
                    sortBy === 'rating'
                        ? { 'psychologist.averageRating': -1 }
                        : sortBy === 'combined'
                            ? { combinedScore: -1 }
                            : { totalConsultations: -1 },
            },

            { $limit: limit },

            {
                $project: {
                    _id: 1,
                    totalConsultations: 1,
                    'psychologist.userId': 1,
                    'psychologist.aboutMe': 1,
                    'psychologist.qualification': 1,
                    'psychologist.defaultFee': 1,
                    'psychologist.isVerified': 1,
                    'psychologist.specializationFees': 1,
                    'psychologist.averageRating': 1,
                    'psychologist.totalReviews': 1,
                    specializationData: 1,
                    user: 1,
                },
            },
        ]);

        return topPsychologists.map(item => ({
            psychologist: {
                id: item._id.toString(),
                userId: item.psychologist.userId.toString(),
                aboutMe: item.psychologist.aboutMe,
                qualification: item.psychologist.qualification,
                defaultFee: item.psychologist.defaultFee,
                isVerified: item.psychologist.isVerified,
                averageRating: item.psychologist.averageRating ?? 0,
                totalReviews: item.psychologist.totalReviews ?? 0,
                specializations: item.specializationData.map((s: IServiceDocument) => s.name),
            } as Psychologist,
            user: {
                name: item.user.name,
                email: item.user.email,
                phone: item.user.phone,
                isActive: item.user.isActive,
                profileImage: item.user.profileImage,
            } as User,
            totalConsultations: item.totalConsultations,
            averageRating: item.psychologist.averageRating ?? 0,
            totalReviews: item.psychologist.totalReviews ?? 0,
        }));
    }

    async getConsultationTrend(psychologistId: string, filter: RevenueFilter): Promise<IPsychologistBookingTrend[]> {
        const groupByFormat =
            filter === RevenueFilter.DAILY
                ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                : filter === RevenueFilter.WEEKLY
                    ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

        const consultations = await ConsultationModel.aggregate([
            { $match: { psychologistId: new Types.ObjectId(psychologistId) } },
            {
                $group: {
                    _id: { date: groupByFormat, status: '$status' },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: '$_id.date',
                    data: {
                        $push: { status: '$_id.status', count: '$count' },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    completed: {
                        $ifNull: [
                            {
                                $first: {
                                    $filter: { input: '$data', as: 'd', cond: { $eq: ['$$d.status', 'completed'] } },
                                },
                            },
                            { count: 0 },
                        ],
                    },
                    cancelled: {
                        $ifNull: [
                            {
                                $first: {
                                    $filter: { input: '$data', as: 'd', cond: { $eq: ['$$d.status', 'cancelled'] } },
                                },
                            },
                            { count: 0 },
                        ],
                    },
                    booked: {
                        $ifNull: [
                            {
                                $first: {
                                    $filter: { input: '$data', as: 'd', cond: { $eq: ['$$d.status', 'booked'] } },
                                },
                            },
                            { count: 0 },
                        ],
                    },
                },
            },
            {
                $project: {
                    date: 1,
                    completed: '$completed.count',
                    cancelled: '$cancelled.count',
                    booked: '$booked.count',
                },
            },
            { $sort: { date: 1 } },
        ]);

        return consultations;
    }

    async getUniqueClientTrend(psychologistId: string, filter: RevenueFilter): Promise<IUniqueClientTrend[]> {
        const groupByFormat =
            filter === RevenueFilter.DAILY
                ? { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
                : filter === RevenueFilter.WEEKLY
                    ? { $dateToString: { format: '%Y-%U', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

        const trend = await ConsultationModel.aggregate([
            { 
                $match: {
                    psychologistId: new mongoose.Types.ObjectId(psychologistId),
                    status: { $in: [ConsultationStatus.COMPLETED, ConsultationStatus.BOOKED] },
                },
            },
            {
                $group: {
                    _id: {
                        date: groupByFormat,
                        userId: '$userId',
                    },
                },
            },
            {
                $group: {
                    _id: '$_id.date',
                    uniqueUsers: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    uniqueUsers: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);

        return trend;
    }
}
