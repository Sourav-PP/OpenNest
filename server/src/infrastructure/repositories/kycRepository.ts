import { Kyc } from "../../domain/entities/Kyc";
import { IKycRepository } from "../../domain/interfaces/IKycRepository";
import { KycModel } from "../database/models/psychologist/kycModel";


export class KycRepository implements IKycRepository {
    async create(data: Kyc): Promise<Kyc> {
        const createdKyc = await KycModel.create(data)
        const obj = createdKyc.toObject()

        return {
            id: obj._id.toString(),
            psychologistId: obj.psychologistId.toString(),
            identificationDoc: obj.identificationDoc,
            educationalCertification: obj.educationalCertification,
            experienceCertificate: obj.experienceCertificate,
            kycStatus: obj.kycStatus as 'pending' | 'approved' | 'rejected',
            rejectionReason: obj.rejectionReason,
            verifiedAt: obj.verifiedAt,
        }
    }

    async findByPsychologistId(psychologistId: string): Promise<Kyc | null> {
        const kycDoc = await KycModel.findOne({psychologistId})
        if(!kycDoc) return null

        const obj = kycDoc.toObject()

        return {
            id: obj._id.toString(),
            psychologistId: obj.psychologistId.toString(),
            identificationDoc: obj.identificationDoc,
            educationalCertification: obj.educationalCertification,
            experienceCertificate: obj.experienceCertificate,
            kycStatus: obj.kycStatus as 'pending' | 'approved' | 'rejected',
            rejectionReason: obj.rejectionReason,
            verifiedAt: obj.verifiedAt,
        }
    }

    async updateByPsychologistId(psychologistId: string | undefined, updateData: Partial<Kyc>): Promise<Kyc | null> {
        return KycModel.findByIdAndUpdate(
            {psychologistId},
            {$set: updateData},
            {new: true}
        )
    }
}