// useCases/plan/GetAllPlansUseCase.ts
import { IPlanRepository } from '@/domain/repositoryInterface/IPlanRepository';

export class GetAllPlansUseCase {
    constructor(private planRepository: IPlanRepository) {}

    async execute() {
        return await this.planRepository.findAll();
    }
}
