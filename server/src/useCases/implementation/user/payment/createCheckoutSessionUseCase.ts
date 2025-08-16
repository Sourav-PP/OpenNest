import { ICreateCheckoutSessionUseCase } from '@/useCases/interfaces/user/payment/ICreateCheckoutSessionUseCase';
import {
    ICreateCheckoutSessionInput,
    ICreateCheckoutSessionOutput,
} from '@/useCases/types/payment';
import { IPaymentService } from '@/domain/serviceInterface/IPaymentService';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { AppError } from '@/domain/errors/AppError';
import { Payment } from '@/domain/entities/payment';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { appConfig } from '@/infrastructure/config/config';




export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
    private _paymentService: IPaymentService;
    private _paymentRepository: IPaymentRepository;
    private _slotRepo: ISlotRepository;

    constructor(
        paymentService: IPaymentService,
        paymentRepository: IPaymentRepository,
        slotRepo: ISlotRepository,
    ) {
        this._paymentService = paymentService;
        this._paymentRepository = paymentRepository;
        this._slotRepo = slotRepo;
    }

    async execute( input: ICreateCheckoutSessionInput): Promise<ICreateCheckoutSessionOutput> {
        if (!input.userId) {
            throw new AppError(adminMessages.ERROR.USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }
        const slot = await this._slotRepo.findById(input.slotId);
        if (!slot) {
            throw new AppError(psychologistMessages.ERROR.SLOT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const currency = appConfig.stripe.currency || 'usd';
        const successUrl = appConfig.stripe.frontendSuccessUrl;
        const cancelUrl = appConfig.stripe.frontendCancelUrl;

        const metadata: {
            patientId: string;
            psychologistId: string;
            slotId: string;
            startDateTime: string;
            endDateTime: string;
            sessionGoal: string;
            subscriptionId?: string;
        } = {
            patientId: input.userId,
            psychologistId: input.psychologistId,
            slotId: input.slotId,
            startDateTime: slot.startDateTime.toISOString(),
            endDateTime: slot.endDateTime.toISOString(),
            sessionGoal: input.sessionGoal,
        };

        if (input.subscriptionId) {
            metadata.subscriptionId = input.subscriptionId;
        }

        const { url, sessionId } = await this._paymentService.createCheckoutSession(
            input.amount,
            currency,
            `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl,
            metadata,
        );


        const payment: Omit<Payment, 'id'> = {
            userId: input.userId,
            amount: input.amount,
            currency: appConfig.stripe.currency || 'usd',
            paymentMethod: 'stripe',
            paymentStatus: 'pending',
            refunded: false,
            transactionId: undefined,
            stripeSessionId: sessionId,
        };

        await this._paymentRepository.create(payment);

        return {
            url: url,
        };
    }
}
