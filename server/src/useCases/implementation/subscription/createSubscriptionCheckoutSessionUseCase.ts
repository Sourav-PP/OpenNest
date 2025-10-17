import { PaymentMethod, PaymentPurpose, PaymentStatus } from '@/domain/enums/PaymentEnums';
import { AppError } from '@/domain/errors/AppError';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPlanRepository } from '@/domain/repositoryInterface/IPlanRepository';
import { IPaymentService } from '@/domain/serviceInterface/IPaymentService';
import { appConfig } from '@/infrastructure/config/config';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { SubscriptionMessages } from '@/shared/constants/messages/subscriptionMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateSubscriptionCheckoutSessionUseCase } from '@/useCases/interfaces/subscription/ICreateSubscriptionCheckoutSessionUseCase';

export class CreateSubscriptionCheckoutSessionUseCase implements ICreateSubscriptionCheckoutSessionUseCase {
    private _paymentService: IPaymentService;
    private _paymentRepository: IPaymentRepository;
    private _planRepository: IPlanRepository;

    constructor(
        paymentService: IPaymentService,
        paymentRepository: IPaymentRepository,
        planRepository: IPlanRepository,
    ) {
        this._paymentService = paymentService;
        this._paymentRepository = paymentRepository;
        this._planRepository = planRepository;
    }

    async execute(userId: string, planId: string, psychologistId: string): Promise<string> {
        if (!userId) {
            throw new AppError(adminMessages.ERROR.USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        if (!planId) {
            throw new AppError(SubscriptionMessages.ERROR.PLAN_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const plan = await this._planRepository.findById(planId);
        if (!plan) {
            throw new AppError(SubscriptionMessages.ERROR.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const currency = appConfig.stripe.currency || 'usd';
        const successUrl = `${appConfig.server.frontendUrl}/user/psychologists/${psychologistId}`;
        const cancelUrl = `${appConfig.server.frontendUrl}/user/psychologists/${psychologistId}`;

        const { url, sessionId } = await this._paymentService.createCheckoutSession(
            plan.price,
            currency,
            successUrl,
            cancelUrl,
            {
                userId,
                priceId: plan.stripePriceId,
                planId: plan.id,
                purpose: PaymentPurpose.SUBSCRIPTION,
            },
        );

        await this._paymentRepository.create({
            userId,
            amount: plan.price,
            currency,
            paymentMethod: PaymentMethod.STRIPE,
            paymentStatus: PaymentStatus.PENDING,
            refunded: false,
            transactionId: undefined,
            stripeSessionId: sessionId,
            slotId: null,
            purpose: PaymentPurpose.SUBSCRIPTION,
        });

        return url;
    }
}
