import mongoose from 'mongoose';
import { Kyc } from '../../../domain/entities/kyc';
import { IKycRepository } from '../../../domain/repositoryInterface/IKycRepository';
import { KycModel } from '../../database/models/psychologist/kycModel';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';


export class KycRepository implements IKycRepository {
    async create(data: Omit<Kyc, 'id'>): Promise<Kyc> {
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
    }): Promise<{ kyc: Kyc; psychologist: Psychologist; user: User }[]> {

        const matchStage: Record<string , unknown> = {};

        if (params.status && params.status !== 'all') {
            matchStage.status = params.status;
        }

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

        const result = await KycModel.aggregate(pipeline);

        return result.map((item) => ({
            kyc: {
                id: item.id.toString(),
                psychologistId: item.psychologistId.toString(),
                identificationDoc: item.identificationDoc,
                educationalCertification: item.educationalCertification,
                experienceCertificate: item.experienceCertificate,
                kycStatus: item.kycStatus as 'pending' | 'approved' | 'rejected',
                rejectionReason: item.rejectionReason,
                verifiedAt: item.verifiedAt,
            } as Kyc,
            psychologist: {
                id: item.psychologist._id.toString(),
                userId: item.psychologist.userId.toString(),
                aboutMe: item.psychologist.aboutMe,
                qualification: item.psychologist.qualification,
                defaultFee: item.psychologist.defaultFee,
                isVerified: item.psychologist.isVerified,
                specializations: item.psychologist.specializations.map((s: string) => s.toString()),
                specializationFees: item.psychologist.specializationFees || [],
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

    async findByPsychologistIdForAdmin(psychologistId: string): Promise<{ kyc: Kyc; psychologist: Psychologist; user: User } | null> {
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

        if (result.length === 0) return null;

        const obj = result[0];

        return {
            kyc: {
                id: obj.id.toString(),
                psychologistId: obj.psychologistId.toString(),
                identificationDoc: obj.identificationDoc,
                educationalCertification: obj.educationalCertification,
                experienceCertificate: obj.experienceCertificate,
                kycStatus: obj.kycStatus as 'pending' | 'approved' | 'rejected',
                rejectionReason: obj.rejectionReason,
                verifiedAt: obj.verifiedAt,
            } as Kyc,
            psychologist: {
                id: obj.psychologist._id.toString(),
                userId: obj.psychologist.userId.toString(),
                aboutMe: obj.psychologist.aboutMe,
                qualification: obj.psychologist.qualification,
                defaultFee: obj.psychologist.defaultFee,
                isVerified: obj.psychologist.isVerified,
                specializations: obj.psychologist.specializations.map((s: string) => s.toString()),
                specializationFees: obj.psychologist.specializationFees || [],
            } as Psychologist,
            user: {
                id: obj.user._id.toString(),
                name: obj.user.name,
                email: obj.user.email,
                phone: obj.user.phone,
                isActive: obj.user.isActive,
                profileImage: obj.user.profileImage,
            } as User,
        };
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