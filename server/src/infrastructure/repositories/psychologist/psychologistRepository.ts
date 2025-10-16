import { Psychologist } from '@/domain/entities/psychologist';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IServiceDocument, ServiceModel } from '@/infrastructure/database/models/admin/serviceModel';
import {
    PsychologistModel,
    IPsychologistDocument,
} from '@/infrastructure/database/models/psychologist/PsychologistModel';
import { User } from '@/domain/entities/user';
import { PipelineStage } from 'mongoose';
import { GenericRepository } from '../GenericRepository';
import { ConsultationModel } from '@/infrastructure/database/models/user/Consultation';
import { UserGender, UserGenderFilter, UserRole } from '@/domain/enums/UserEnums';
import { ConsultationPaymentStatus, ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { SortFilter } from '@/domain/enums/SortFilterEnum';

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
            specializations: (mapped.specializations as any[]).map(id =>
                id.toString(),
            ),
            defaultFee: mapped.defaultFee,
            isVerified: mapped.isVerified,
            specializationFees: mapped.specializationFees.map(fee => ({
                specializationId: fee.specializationId.toString(),
                specializationName: fee.specializationName,
                fee: fee.fee,
            })),
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

        pipeline.push(
            { $sort: { createdAt: sortOrder } },
            { $skip: params.skip },
            { $limit: params.limit },
        );

        const results = await PsychologistModel.aggregate(pipeline);

        return results.map(item => ({
            psychologist: {
                id: item._id.toString(),
                userId: item.userId.toString(),
                aboutMe: item.aboutMe,
                qualification: item.qualification,
                defaultFee: item.defaultFee,
                isVerified: item.isVerified,
                specializations: item.specializationData.map(
                    (s: any) => s.name,
                ),
                specializationFees: item.specializationFees || [],
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

    async countAllPsychologist(params: {
        search?: string;
        gender?: UserGender;
    }): Promise<number> {
        const matchStage: Record<string, unknown> = {
            'user.role': UserRole.PSYCHOLOGIST,
        };

        if (params.search) {
            matchStage['user.name'] = { $regex: params.search, $options: 'i' };
        }

        if (params.gender) {
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

    async updateByUserId(
        userId: string,
        updateData: Partial<Psychologist>,
    ): Promise<Psychologist | null> {
        const doc = await PsychologistModel.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true },
        );
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

    async findTopPsychologists(limit: number): Promise<{
        psychologist: Psychologist;
        user: User;
        totalConsultations: number;
    }[]> {
        const topPsychologists = await ConsultationModel.aggregate([
            { $match: { paymentStatus: ConsultationPaymentStatus.PAID, status: ConsultationStatus.COMPLETED } },

            {
                $group: {
                    _id: '$psychologistId',
                    totalConsultations: { $sum: 1 },
                },
            },

            { $sort: { totalConsultations: -1 } },

            { $limit: limit },

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
                $project: {
                    _id: 1,
                    totalConsultations: 1,
                    'psychologist.userId': 1,
                    'psychologist.aboutMe': 1,
                    'psychologist.qualification': 1,
                    'psychologist.defaultFee': 1,
                    'psychologist.isVerified': 1,
                    'psychologist.specializationFees': 1,
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
                specializations: item.specializationData.map(
                    (s: IServiceDocument) => s.name,
                ),    
            } as Psychologist,
            user: {
                name: item.user.name,
                email: item.user.email,
                phone: item.user.phone,
                isActive: item.user.isActive,
                profileImage: item.user.profileImage,
            } as User,
            totalConsultations: item.totalConsultations,
        }));
    }
}
