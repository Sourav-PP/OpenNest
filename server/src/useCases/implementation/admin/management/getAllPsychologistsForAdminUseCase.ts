import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IGetAllPsychologistsForAdminUseCase } from '@/useCases/interfaces/admin/management/IGetAllPsychologistsForAdminUseCase';
import {
    IGetAllPsychologistRequest,
    IGetAllPsychologistResponse,
} from '@/useCases/types/adminTypes';
import { toPsychologistListDto } from '@/useCases/mappers/psychologistMapper';
import { SortFilter } from '@/domain/enums/SortFilterEnum';

export class GetAllPsychologistsForAdminUseCase implements IGetAllPsychologistsForAdminUseCase
{
    private _psychologistRepo: IPsychologistRepository;

    constructor(psychologistRepo: IPsychologistRepository) {
        this._psychologistRepo = psychologistRepo;
    }

    async execute(
        input: IGetAllPsychologistRequest,
    ): Promise<IGetAllPsychologistResponse> {
        const { search, sort, gender, page = 1, limit = 10 } = input;
        const finalSort =
            sort === SortFilter.ASC || sort === SortFilter.DESC
                ? sort
                : SortFilter.DESC;
        const skip = (page - 1) * limit;

        const entities = await this._psychologistRepo.findAllPsychologists({
            search,
            sort: finalSort,
            gender,
            skip,
            limit,
        });

        const mapped = entities.map(entity =>
            toPsychologistListDto(entity.psychologist, entity.user),
        );

        const totalCount = await this._psychologistRepo.countAllPsychologist({
            search,
            gender,
        });

        return {
            psychologists: mapped,
            totalCount,
        };
    }
}
