import { Psychologist } from '../../domain/entities/psychologist';
import { IPsychologistListDto } from '../../domain/dtos/psychologist';
import { IPsychologistRepository } from '../../domain/interfaces/IPsychologistRepository';
import { ServiceModel } from '../database/models/admin/serviceModel';
import { PsychologistModel } from '../database/models/psychologist/PsychologistModel';
import { PsychologistAggregateModel } from './types/psychologists';
import { FilterQuery } from 'mongoose';

export class PsychologistRepository implements IPsychologistRepository {
    async create(psychologist: Psychologist): Promise<Psychologist> {
        const createdPsychologist = await PsychologistModel.create(psychologist);
        const obj = createdPsychologist.toObject();

        return {
            id: obj._id.toString(),
            isVerified: obj.isVerified,
        } as Psychologist;
    }

    async findAllPsychologists(params: { search?: string; sort?: 'asc' | 'desc'; gender?: 'Male' | 'Female'; skip: number; limit: number; }): Promise<IPsychologistListDto[]> {
        const matchStage: Record<string , unknown> = { 'user.role': 'psychologist' };

        if (params.search) {
            matchStage['user.name'] = { $regex: params.search, $options: 'i' };
        }

        if (params.gender) {
            matchStage['user.gender'] = params.gender;
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const psychologists = await PsychologistModel.aggregate([
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
            {
                $lookup: {
                    from: 'services',
                    localField: 'specializations',
                    foreignField: '_id',
                    as: 'specializationData',   
                },
            },
            { $sort: { createdAt: sortOrder } },
            { $skip: params.skip },
            { $limit: params.limit },
            {
                $project: {
                    id: '$_id',
                    userId: '$userId',
                    aboutMe: 1,
                    qualification: 1,
                    defaultFee: 1,
                    isVerified: 1,
                    specializations: '$specializationData.name',
                    specializationFees: 1,
                    user: {
                        name: '$user.name',
                        email: '$user.email',
                        phone: '$user.phone',
                        isActive: '$user.isActive',
                        profileImage: '$user.profileImage',
                    },
                },
            },
        ]);

        return psychologists;
    }

    async countAllPsychologist(params: { search?: string; gender?: 'Male' | 'Female'; }): Promise<number> {
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
        const psychologistDoc = await PsychologistModel.findById(psychologistId);
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

    async updateByUserId(userId: string, updateData: Partial<Psychologist>): Promise<Psychologist | null> {
        return PsychologistModel.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true },
        );
    }

    async updateById(id: string, updateData: Partial<Psychologist>): Promise<Psychologist | null> {
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
        const specializations = await ServiceModel.find({ _id: { $in: ids } }).select('name');
        return specializations.map(s => s.name);
    }

    async getAllPsychologists(params: {
        search?: string;
        sort?: 'asc' | 'desc';
        gender?: 'Male' | 'Female' | 'all';
        expertise?: string;
        skip: number;
        limit: number;
    }): Promise<IPsychologistListDto[]> {
        const matchStage: Record<string , unknown> = { isVerified: true };
        const sortOrder = params.sort === 'asc' ? 1 : -1;
        
        const pipeline: any[] = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userData',
                },   
            },
            { $unwind: '$userData' },
            {
                $lookup: {
                    from: 'services',
                    localField: 'specializations',
                    foreignField: '_id',
                    as: 'specializationData',
                },
            },
        ];

        if (params.gender && params.gender !== 'all') {
            pipeline.push({
                $match: {
                    'userData.gender': params.gender,
                },
            });
        }

        if (params.search && params.search !== '') {
            pipeline.push({
                $match: {
                    'userData.name': { $regex: params.search, $options: 'i' },
                },
            });
        }

        if (params.expertise && params.expertise !== 'all') {
            pipeline.push({
                $match: {
                    'specializationData.name': params.expertise,
                },
            });
        }
        
        pipeline.push({
            $project: {
                _id: 1,
                userId: 1,
                isVerified: 1,
                aboutMe: 1,
                qualification: 1,
                defaultFee: 1,
                specializationFees: 1,
                user: {
                    name: '$userData.name',
                    email: '$userData.email',
                    profileImage: '$userData.profileImage',
                },
                specializations: '$specializationData.name',
            },
        });

        if (params.sort) {
            pipeline.push({
                $sort: { defaultFee: sortOrder },
            });
        }

        pipeline.push({ $skip: params.skip });
        pipeline.push({ $limit: params.limit });

        const result: PsychologistAggregateModel[] = await PsychologistModel.aggregate(pipeline);

        const psychologists: IPsychologistListDto[] = result.map((p) => ({
            id: p._id.toString(), // convert ObjectId to string
            userId: p.userId.toString(),
            isVerified: p.isVerified,
            aboutMe: p.aboutMe,
            qualification: p.qualification,
            defaultFee: p.defaultFee,
            specializationFees: p.specializationFees ?? [],
            specializations: p.specializations,
            user: {
                name: p.user.name,
                email: p.user.email,
                profileImage: p.user.profileImage,
            },
        }));

        return psychologists;
    }
}