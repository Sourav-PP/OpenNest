import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";
import { Psychologist } from "../../../../domain/entities/psychologist";
import { IPsychologistResponseDto } from "../../../../domain/dtos/psychologist";
import { IGetAllPsychologistRequest, IGetAllPsychologistResponse } from "../../../types/userTypes";

export class GetAllPsychologistUseCasee {
    constructor(private psychologistRepo: IPsychologistRepository) {}

    async execute(input: IGetAllPsychologistRequest): Promise<IGetAllPsychologistResponse> {

        const {search, sort, gender, expertise, page = 1, limit = 10} = input
        const finalSort = (sort === "asc" || sort === "desc") ? sort : "desc"
        const skip = (page - 1) * limit

        const psychologists = await this.psychologistRepo.getAllPsychologists({
            search,
            sort: finalSort,
            gender,
            expertise,
            skip,
            limit
        })

        const totalCount = await this.psychologistRepo.countAllVerified()
        const mappedPsychologists =  psychologists.map(p => ({
            id: p.id,
            userId: p.userId,
            email: p.user.email,
            aboutMe: p.aboutMe,
            defaultFee: p.defaultFee,
            name: p.user.name,
            profileImage: p.user.profileImage,
            qualification: p.qualification,
            specializations: p.specializations,
            specializationFees: p.specializationFees
        }))

        return {
            psychologists: mappedPsychologists,
            totalCount
        }
    }
}