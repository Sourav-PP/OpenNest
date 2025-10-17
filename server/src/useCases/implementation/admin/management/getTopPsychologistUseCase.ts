import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { TopPsychologistDTO } from '@/useCases/dtos/psychologist';
import { IGetTopPsychologistUseCase } from '@/useCases/interfaces/admin/management/IGetTopPsychologistUseCase';
import { toTopPsychologistDto } from '@/useCases/mappers/payoutMapper';

export class GetTopPsychologistUseCase implements IGetTopPsychologistUseCase {
    private _psychologistRepository: IPsychologistRepository;

    constructor(psychologistRepository: IPsychologistRepository) {
        this._psychologistRepository = psychologistRepository;
    }

    async execute(limit: number): Promise<TopPsychologistDTO[]> {
        const topPsychologists = await this._psychologistRepository.findTopPsychologists(limit);
        return topPsychologists.map(toTopPsychologistDto);
    }
}
