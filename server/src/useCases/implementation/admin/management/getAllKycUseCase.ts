import { IGetAllKycUseCase } from "../../../interfaces/admin/management/IGetAllKycUseCase";
import { IKycRepository } from "../../../../domain/interfaces/IKycRepository";
import { IGetAllKycRequest, IGetAllKycResponse } from "../../../types/adminTypes";

export class GetAllKycUseCase implements IGetAllKycUseCase {
    constructor (
        private kycRepo: IKycRepository
    ) {}

    async execute(input: IGetAllKycRequest): Promise<IGetAllKycResponse> {
        const {search, sort, limit = 10, page = 1, status} = input

        console.log('limit in usecase: ', limit)
        console.log('page in usecase: ', page)
        const finalSort = (sort === "asc" || sort === "desc") ? sort : "desc"
        const skip = (page - 1) * limit

        const data = await this.kycRepo.findAll({
            search,
            sort: finalSort,
            limit,
            status: status ? status : 'all',
            skip
        })

        const totalCount = await this.kycRepo.countAll()

        return {
            kycs: data,
            totalCount
        }
    }
}