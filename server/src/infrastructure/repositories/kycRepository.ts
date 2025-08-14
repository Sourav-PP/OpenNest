import mongoose from 'mongoose';
import { IKycDto } from '../../domain/dtos/kyc';
import { Kyc } from '../../domain/entities/kyc';
import { IKycRepository } from '../../domain/interfaces/IKycRepository';
import { KycModel } from '../database/models/psychologist/kycModel';


export class KycRepository implements IKycRepository {
    async create(data: Kyc): Promise<Kyc> {
        const createdKyc = await KycModel.create(data);
        const obj = createdKyc.toObject();

        return {
            id: obj._id.toString(),
            psychologistId: obj.psychologistId.toString(),
            identificationDoc: obj.identificationDoc,
            educationalCertification: obj.educationalCertification,
            experienceCertificate: obj.experienceCertificate,
            kycStatus: obj.kycStatus as 'pending' | 'approved' | 'rejected',
            rejectionReason: obj.rejectionReason,
            verifiedAt: obj.verifiedAt,
        };
    }

    async findAll(params: {
        search?: string,
        sort?:'asc' | 'desc',
        skip?: number,
        limit?: number,
        status: 'pending' | 'approved' | 'rejected' | 'all';
    }): Promise<IKycDto[]> {
        const matchStage: Record<string , unknown> = {};

        if (params.status && params.status !== 'all') {
            matchStage.status = params.status;
        }

        console.log('params: ', params);
        if (params.search ) {
            matchStage.$or = [
                { 'user.name': { $regex: params.search, $options: 'i' } },
                { 'user.email': { $regex: params.search, $options: 'i' } },
            ];
        }

        const sortOrder = params.sort === 'asc' ? 1 : -1;

        const pipeline: any[] = [
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
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $match: matchStage },
            {
                $project: {
                    id: '$_id',
                    psychologistId: '$psychologistId',
                    psychologistName: '$user.name',
                    psychologistEmail: '$user.email',
                    qualification: '$psychologist.qualification',
                    kycStatus: 1,
                    identificationDoc: 1,
                    educationalCertification: 1,
                    experienceCertificate: 1,
                    status: 1,
                },
            },
            {
                $sort: { createdAt: sortOrder, _id: sortOrder },
            },
            { $skip: params.skip || 0 },
            { $limit: params.limit || 10 },
        ];

        const data = await KycModel.aggregate(pipeline);
        console.log('data: ', data);
        return data;
    }

    async findByPsychologistIdForAdmin(psychologistId: string): Promise<IKycDto | null> {
        const matchStage: Record<string , unknown> = { psychologistId: new mongoose.Types.ObjectId(psychologistId) };

        const pipeline: any[] = [
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
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    id: '$_id',
                    psychologistId: '$psychologistId',
                    psychologistName: '$user.name',
                    psychologistEmail: '$user.email',
                    profileImage: '$user.profileImage',
                    qualification: '$psychologist.qualification',
                    kycStatus: 1,
                    identificationDoc: 1,
                    educationalCertification: 1,
                    experienceCertificate: 1,
                    status: 1,
                },
            },
            { $limit: 1 },
        ];

        const result = await KycModel.aggregate(pipeline);

        console.log('single kycdetail: ', result);
        return result.length > 0 ? (result[0] as IKycDto) : null;
    }

    async countAll(): Promise<number> {
        return await KycModel.countDocuments();
    }

    async findByPsychologistId(psychologistId: string): Promise<Kyc | null> {
        const kycDoc = await KycModel.findOne({ psychologistId });
        if (!kycDoc) return null;

        const obj = kycDoc.toObject();

        return {
            id: obj._id.toString(),
            psychologistId: obj.psychologistId.toString(),
            identificationDoc: obj.identificationDoc,
            educationalCertification: obj.educationalCertification,
            experienceCertificate: obj.experienceCertificate,
            kycStatus: obj.kycStatus as 'pending' | 'approved' | 'rejected',
            rejectionReason: obj.rejectionReason,
            verifiedAt: obj.verifiedAt,
        };
    }

    async updateByPsychologistId(psychologistId: string | undefined, updateData: Partial<Kyc>): Promise<Kyc | null> {
        return KycModel.findByIdAndUpdate(
            { psychologistId },
            { $set: updateData },
            { new: true },
        );
    }

    async approveKyc(psychologistId: string): Promise<void> {
        await KycModel.updateOne(
            { psychologistId },
            { $set: {
                kycStatus: 'approved',
                verifiedAt: new Date(),
                rejectionReason: null,
            } },
            { new: true },
        );
    }

    async rejectKyc(psychologistId: string, reason: string): Promise<void> {
        await KycModel.updateOne(
            { psychologistId },
            { $set: {
                kycStatus: 'rejected',
                rejectionReason: reason,
                verifiedAt: null,
            } },
            { new: true },
        );
    }
}