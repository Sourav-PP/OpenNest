import { IPsychologist } from "../../domain/entities/psychologist";
import { PsychologistRepository } from "../../domain/interfaces/psychologistRepository";
import { PsychologistModel } from "../database/models/psychologist/PsychologistModel";

export class MongoPsychologistRepository implements PsychologistRepository {
    async create(psychologist: IPsychologist): Promise<IPsychologist> {
        const createdPsychologist = await PsychologistModel.create(psychologist)
        const obj = createdPsychologist.toObject()

        return {
            _id: obj._id.toString(),
            isVerified: obj.isVerified
        } as IPsychologist
    }

    async findById(psychologistId: string): Promise<IPsychologist | null> {
        const psychologistDoc = await PsychologistModel.findById(psychologistId)
        if(!psychologistDoc) return null

        const obj = psychologistDoc.toObject()
        return {
            _id: obj._id.toString(),
            userId: obj.userId.toString(),
            aboutMe: obj.aboutMe,
            qualification: obj.qualification,
            specializations: obj.specializations.map(id => id.toString()),
            defaultFee: obj.defaultFee,
            isVerified: obj.isVerified,
            specializationFees: obj.specializationFees.map(fee => ({
                specializationId: fee.specializationId.toString(),
                specializationName: fee.specializationName,
                fee: fee.fee
            }))
        };
    }
}