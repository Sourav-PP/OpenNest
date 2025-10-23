import { TopPsychologistSortFilter } from '@/domain/enums/SortFilterEnum';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { TopPsychologistDTO } from '@/useCases/dtos/psychologist';
import { IGetTopPsychologistUseCase } from '@/useCases/interfaces/admin/management/IGetTopPsychologistUseCase';
import { toTopPsychologistDto } from '@/useCases/mappers/payoutMapper';

export class GetTopPsychologistUseCase implements IGetTopPsychologistUseCase {
    private _psychologistRepository: IPsychologistRepository;

    constructor(psychologistRepository: IPsychologistRepository) {
        this._psychologistRepository = psychologistRepository;
    }

    async execute(limit: number, sortBy: TopPsychologistSortFilter): Promise<TopPsychologistDTO[]> {
        const topPsychologists = await this._psychologistRepository.findTopPsychologists(limit, sortBy);
        return topPsychologists.map(toTopPsychologistDto);
    }
}
