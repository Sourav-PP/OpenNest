import { Psychologist } from '@/domain/entities/psychologist';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { ServiceModel } from '@/infrastructure/database/models/admin/serviceModel';
import { PsychologistModel } from '@/infrastructure/database/models/psychologist/PsychologistModel';
import { User } from '@/domain/entities/user';

export class PsychologistRepository implements IPsychologistRepository {
    async create(
        psychologist: Omit<Psychologist, 'id'>,
    ): Promise<Psychologist> {
        const createdPsychologist =
            await PsychologistModel.create(psychologist);
        const obj = createdPsychologist.toObject();

        return {
            id: obj._id.toString(),
            isVerified: obj.isVerified,
        } as Psychologist;
    }

    async findAllPsychologists(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        gender?: 'Male' | 'Female';
        expertise?: string;
        skip: number;
        limit: number;
    }): Promise<{ psychologist: Psychologist; user: User }[]> {
        const matchStage: Record<string, unknown> = {
            'user.role': 'psychologist',
        };

        if (params.search) {
            matchStage['user.name'] = { $regex: params.search, $options: 'i' };
        }

        if (params.gender) {
            matchStage['user.gender'] = params.gender;
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const pipeline: any[] = [
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
                id: item.id.toString(),
                userId: item.userId.toString(),
                aboutMe: item.aboutMe,
                qualification: item.qualification,
                defaultFee: item.defaultFee,
                isVerified: item.isVerified,
                specializations: item.specializations.map((s: string) =>
                    s.toString(),
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
        gender?: 'Male' | 'Female';
    }): Promise<number> {
        const matchStage: Record<string, unknown> = {
            'user.role': 'psychologist',
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

    async findById(psychologistId: string): Promise<Psychologist | null> {
        const psychologistDoc =
            await PsychologistModel.findById(psychologistId);
        if (!psychologistDoc) return null;

        const obj = psychologistDoc.toObject();
        return {
            id: obj._id.toString(),
            userId: obj.userId.toString(),
            aboutMe: obj.aboutMe,
            qualification: obj.qualification,
            specializations: obj.specializations.map(id => id.toString()),
            defaultFee: obj.defaultFee,
            isVerified: obj.isVerified,
            specializationFees: obj.specializationFees.map(fee => ({
                specializationId: fee.specializationId.toString(),
                specializationName: fee.specializationName,
                fee: fee.fee,
            })),
        };
    }

    async updateByUserId(
        userId: string,
        updateData: Partial<Psychologist>,
    ): Promise<Psychologist | null> {
        return PsychologistModel.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true },
        );
    }

    async updateById(
        id: string,
        updateData: Partial<Psychologist>,
    ): Promise<Psychologist | null> {
        return PsychologistModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true },
        );
    }

    async findByUserId(userId: string): Promise<Psychologist | null> {
        const doc = await PsychologistModel.findOne({ userId });
        if (!doc) return null;

        const obj = doc.toObject();
        return {
            id: obj._id.toString(),
            userId: obj.userId.toString(),
            aboutMe: obj.aboutMe,
            qualification: obj.qualification,
            specializations: obj.specializations.map(id => id.toString()),
            defaultFee: obj.defaultFee,
            isVerified: obj.isVerified,
            specializationFees: obj.specializationFees.map(fee => ({
                specializationId: fee.specializationId.toString(),
                specializationName: fee.specializationName,
                fee: fee.fee,
            })),
        };
    }

    async getSpecializationNamesByIds(ids: string[]): Promise<string[]> {
        const specializations = await ServiceModel.find({
            _id: { $in: ids },
        }).select('name');
        return specializations.map(s => s.name);
    }
}
