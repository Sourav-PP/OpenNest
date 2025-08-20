import { IGetAllPsychologistsForUserUseCase } from '@/useCases/interfaces/signup/IGetAllPsychologistsForUserUseCase';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import {
    IGetAllPsychologistRequest,
    IGetAllPsychologistResponse,
} from '@/useCases/types/userTypes';
import { toUserPsychologistListDto } from '@/useCases/mappers/psychologistMapper';




export class GetAllPsychologistsForUserUseCase implements IGetAllPsychologistsForUserUseCase {
    private _psychologistRepo: IPsychologistRepository;

    constructor(psychologistRepo: IPsychologistRepository) {
        this._psychologistRepo = psychologistRepo;
    }

    async execute( input: IGetAllPsychologistRequest ): Promise<IGetAllPsychologistResponse> {
        const { search, sort, gender, expertise, page = 1, limit = 10 } = input;
        const finalSort = sort === 'asc' || sort === 'desc' ? sort : 'desc';
        const skip = (page - 1) * limit;

        const entities = await this._psychologistRepo.findAllPsychologists({
            search,
            sort: finalSort,
            gender,
            expertise,
            skip,
            limit,
        });

        console.log('entities: ', entities);

        const mapped = entities.map(entity => toUserPsychologistListDto(entity.psychologist, entity.user));

        const totalCount = await this._psychologistRepo.countAllVerified();

        return {
            psychologists: mapped,
            totalCount,
        };
    }
}
