import { IGetAllPsychologistsForUserUseCase } from '@/useCases/interfaces/signup/IGetAllPsychologistsForUserUseCase';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import {
    IGetAllPsychologistRequest,
    IGetAllPsychologistResponse,
} from '@/useCases/types/userTypes';
import { toUserPsychologistListDto } from '@/useCases/mappers/psychologistMapper';
import { SortFilter } from '@/domain/enums/SortFilterEnum';

export class GetAllPsychologistsForUserUseCase implements IGetAllPsychologistsForUserUseCase {
    private _psychologistRepo: IPsychologistRepository;

    constructor(psychologistRepo: IPsychologistRepository) {
        this._psychologistRepo = psychologistRepo;
    }

    async execute(
        input: IGetAllPsychologistRequest,
    ): Promise<IGetAllPsychologistResponse> {
        const { search, sort, gender, expertise, page = 1, limit = 10 } = input;
        const finalSort =
            sort === SortFilter.ASC || sort === SortFilter.DESC
                ? sort
                : SortFilter.DESC;
        const skip = (page - 1) * limit;

        const entities = await this._psychologistRepo.findAllPsychologists({
            search,
            sort: finalSort,
            gender,
            expertise,
            skip,
            limit,
        });

        const mapped = entities.map(entity =>
            toUserPsychologistListDto(entity.psychologist, entity.user),
        );

        const totalCount = await this._psychologistRepo.countAllVerified();

        return {
            psychologists: mapped,
            totalCount,
        };
    }
}
