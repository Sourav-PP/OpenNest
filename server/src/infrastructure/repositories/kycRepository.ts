import { IKyc } from "../../domain/entities/kyc";
import { KycRepository } from "../../domain/interfaces/kycRepository";
import { KycModel } from "../database/models/psychologist/kycModel";
import { publicKyc } from "../../domain/entities/kyc";

export class MongoKycRepository implements KycRepository {
    async create(data: IKyc): Promise<IKyc> {
        const createdKyc = await KycModel.create(data)
        const obj = createdKyc.toObject()

        return {
            _id: obj._id.toString(),
            psychologistId: obj.psychologistId.toString(),
            identificationDoc: obj.identificationDoc,
            educationalCertification: obj.educationalCertification,
            experienceCertificate: obj.experienceCertificate,
            kycStatus: obj.kycStatus as 'pending' | 'approved' | 'rejected',
            rejectionReason: obj.rejectionReason,
            verifiedAt: obj.verifiedAt,
        }
    }

    async findByPsychologistId(psychologistId: string): Promise<IKyc | null> {
        const kycDoc = await KycModel.findOne({psychologistId})
        if(!kycDoc) return null

        const obj = kycDoc.toObject()

        return {
             _id: obj._id.toString(),
            psychologistId: obj.psychologistId.toString(),
            identificationDoc: obj.identificationDoc,
            educationalCertification: obj.educationalCertification,
            experienceCertificate: obj.experienceCertificate,
            kycStatus: obj.kycStatus as 'pending' | 'approved' | 'rejected',
            rejectionReason: obj.rejectionReason,
            verifiedAt: obj.verifiedAt,
        }
    }

    async updateByPsychologistId(psychologistId: string | undefined, updateData: Partial<IKyc>): Promise<IKyc | null> {
        return KycModel.findByIdAndUpdate(
            {psychologistId},
            {$set: updateData},
            {new: true}
        )
    }
}