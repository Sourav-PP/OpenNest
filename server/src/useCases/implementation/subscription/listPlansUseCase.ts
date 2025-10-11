import { Plan } from '@/domain/entities/plan';
import { IPlanRepository } from '@/domain/repositoryInterface/IPlanRepository';
import { IListPlansUseCase } from '@/useCases/interfaces/subscription/IListPlansUseCase';

export class ListPlansUseCase implements IListPlansUseCase {
    private _planRepository: IPlanRepository;

    constructor(planRepository: IPlanRepository) {
        this._planRepository = planRepository;
    }

    async execute(): Promise<Plan[]> {
        const plans = await this._planRepository.findAll();
        return plans;
    }
}
