import { Plan } from '@/domain/entities/plan';
import { PlanBillingPeriod } from '@/domain/enums/PlanEnums';
import { AppError } from '@/domain/errors/AppError';
import { IPlanRepository } from '@/domain/repositoryInterface/IPlanRepository';
import { IPaymentService } from '@/domain/serviceInterface/IPaymentService';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreatePlanUseCase } from '@/useCases/interfaces/admin/plan/ICreatePlanUseCase';

export class CreatePlanUseCase implements ICreatePlanUseCase {
    private _planRepository: IPlanRepository;
    private _paymentService: IPaymentService;

    constructor(planRepository: IPlanRepository, paymentService: IPaymentService) {
        this._planRepository = planRepository;
        this._paymentService = paymentService;
    }

    async execute(data: {
        name: string;
        description?: string;
        price: number;
        currency: string;
        creditsPerPeriod: number;
        billingPeriod: PlanBillingPeriod;
    }): Promise<Plan> {
        const existingPlan = await this._planRepository.findByName(data.name);
        if (existingPlan) {
            throw new AppError(SubscriptionMessages.ERROR.NAME_ALREADY_EXISTS(data.name), HttpStatus.CONFLICT);
        }
        
        const stripePrice = await this._paymentService.createStripeProductAndPrice(
            data.name,
            data.description || '',
            data.price,
            data.currency,
            data.billingPeriod,
        );

        const plan = await this._planRepository.create({
            name: data.name,
            description: data.description,
            price: data.price,
            currency: data.currency,
            creditsPerPeriod: data.creditsPerPeriod,
            billingPeriod: data.billingPeriod,
            stripePriceId: stripePrice.priceId,
        });

        return plan;
    }
}
