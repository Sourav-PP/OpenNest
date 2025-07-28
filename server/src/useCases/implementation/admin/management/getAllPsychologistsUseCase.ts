import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";
import { IGetAllPsychologistUseCase } from "../../../interfaces/admin/management/IGetAllPsychologistUseCase";
import { IGetAllPsychologistRequest, IGetAllPsychologistResponse } from "../../../types/adminTypes";

export class GetAllPsychologistsUseCase implements IGetAllPsychologistUseCase {
    constructor(private psychologistRepo: IPsychologistRepository) {}

    async execute(input: IGetAllPsychologistRequest): Promise<IGetAllPsychologistResponse> {
        const {search, sort, gender, page = 1, limit = 10} = input
        const finalSort = (sort === "asc" || sort === "desc") ? sort : "desc"
        const skip = (page - 1) * limit

        const psychologists = await this.psychologistRepo.findAllPsychologists({ search, sort: finalSort, skip, limit });
        const totalCount = await this.psychologistRepo.countAllPsychologist({search, gender})

        const mappedPsychologists = psychologists.map(psychologist => ({
            id: psychologist.id.toString(),
            qualification: psychologist.qualification,
            defaultFee: psychologist.defaultFee,
            aboutMe: psychologist.aboutMe,
            specializationFees: psychologist.specializationFees,
            specializations: psychologist.specializations,
            isVerified: psychologist.isVerified,
            user: psychologist.user
        }))

        console.log("psychologists in useCase: ",mappedPsychologists)

        return {
            psychologists: mappedPsychologists,
            totalCount
        }
    }
}