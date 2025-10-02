import { IGetAllKycUseCase } from '@/useCases/interfaces/admin/management/IGetAllKycUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import {
    IGetAllKycRequest,
    IGetAllKycResponse,
} from '@/useCases/types/adminTypes';
import { toKycDto } from '@/useCases/mappers/kycMapper';

export class GetAllKycUseCase implements IGetAllKycUseCase {
    private _kycRepo: IKycRepository;

    constructor(kycRepo: IKycRepository) {
        this._kycRepo = kycRepo;
    }

    async execute(input: IGetAllKycRequest): Promise<IGetAllKycResponse> {
        const { search, sort, limit = 10, page = 1, status } = input;

        const finalSort = sort === 'asc' || sort === 'desc' ? sort : 'desc';
        const skip = (page - 1) * limit;

        const entities = await this._kycRepo.findAllWithDetails({
            search,
            sort: finalSort,
            limit,
            status: status ? status : 'all',
            skip,
        });

        const mapped = entities.map(entity =>
            toKycDto(entity.kyc, entity.psychologist, entity.user),
        );

        const totalCount = await this._kycRepo.countAll();

        return {
            kycs: mapped,
            totalCount,
        };
    }
}
