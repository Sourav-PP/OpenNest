import { AppError } from '@/domain/errors/AppError';
import { IPlanRepository } from '@/domain/repositoryInterface/IPlanRepository';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IDeletePlanUseCase } from '@/useCases/interfaces/admin/plan/IDeletePlanUseCase';

export class DeletePlanUseCase implements IDeletePlanUseCase {
    private _planRepo: IPlanRepository;

    constructor(planRepo: IPlanRepository) {
        this._planRepo = planRepo;
    }

    async execute(planId: string): Promise<void> {
        const plan = await this._planRepo.findById(planId);
        if (!plan) throw new AppError(SubscriptionMessages.ERROR.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND);

        await this._planRepo.deleteById(planId);
    }
}
