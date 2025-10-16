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
import { appConfig } from '@/infrastructure/config/config';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import {
    PaymentMethod,
    PaymentPurpose,
    PaymentStatus,
} from '@/domain/enums/PaymentEnums';

export type IStripeMetaData = {
    patientId: string;
    psychologistId: string;
    slotId: string;
    startDateTime: string;
    endDateTime: string;
    sessionGoal: string;
    subscriptionId?: string;
    purpose: PaymentPurpose;
};

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
    private _paymentService: IPaymentService;
    private _paymentRepository: IPaymentRepository;
    private _slotRepo: ISlotRepository;
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepository: IPsychologistRepository;

    constructor(
        paymentService: IPaymentService,
        paymentRepository: IPaymentRepository,
        slotRepo: ISlotRepository,
        consultationRepo: IConsultationRepository,
        psychologistRepository: IPsychologistRepository,
    ) {
        this._paymentService = paymentService;
        this._paymentRepository = paymentRepository;
        this._slotRepo = slotRepo;
        this._consultationRepo = consultationRepo;
        this._psychologistRepository = psychologistRepository;
    }

    async execute(
        input: ICreateCheckoutSessionInput,
    ): Promise<ICreateCheckoutSessionOutput> {
        if (!input.userId) {
            throw new AppError(
                adminMessages.ERROR.USER_ID_REQUIRED,
                HttpStatus.BAD_REQUEST,
            );
        }

        const currency = appConfig.stripe.currency || 'usd';
        const cancelUrl = appConfig.stripe.frontendCancelUrl;

        let successUrl: string;

        if (input.purpose === PaymentPurpose.WALLET) {
            successUrl = `${appConfig.server.frontendUrl}/user/wallet?success=true&session_id={CHECKOUT_SESSION_ID}`;
        } else {
            successUrl = appConfig.stripe.frontendSuccessUrl;
        }

        let metadata: Record<string, string> = {
            patientId: input.userId,
            purpose: input.purpose,
        };

        if (input.purpose === PaymentPurpose.CONSULTATION) {
            const slot = await this._slotRepo.findById(input.slotId);

            if (!slot) {
                throw new AppError(
                    bookingMessages.ERROR.SLOT_NOT_AVAILABLE,
                    HttpStatus.NOT_FOUND,
                );
            }

            if (slot.isBooked) {
                throw new AppError(
                    bookingMessages.ERROR.SLOT_ALREADY_BOOKED,
                    HttpStatus.CONFLICT,
                );
            }

            metadata = {
                ...metadata,
                psychologistId: slot.psychologistId.toString(),
                slotId: input.slotId.toString(),
                startDateTime: slot.startDateTime.toISOString(),
                endDateTime: slot.endDateTime.toISOString(),
                sessionGoal: input.sessionGoal,
            };

            if (input.subscriptionId) {
                metadata.subscriptionId = input.subscriptionId;
            }
        }

        const { url, sessionId } =
            await this._paymentService.createCheckoutSession(
                input.amount,
                currency,
                `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl,
                metadata,
            );

        // create the payment document before success
        const payment: Omit<Payment, 'id'> = {
            userId: input.userId,
            amount: input.amount,
            currency: appConfig.stripe.currency || 'usd',
            paymentMethod: PaymentMethod.STRIPE,
            paymentStatus: PaymentStatus.PENDING,
            refunded: false,
            transactionId: undefined,
            stripeSessionId: sessionId,
            slotId:
                input.purpose === PaymentPurpose.CONSULTATION
                    ? input.slotId
                    : null,
            purpose: input.purpose,
        };

        try {
            await this._paymentRepository.create(payment);
        } catch (error: any) {
            if (
                error.code === 11000 &&
                input.purpose === PaymentPurpose.CONSULTATION
            ) {
                throw new AppError(
                    bookingMessages.ERROR.SLOT_JUST_BOOKED,
                    HttpStatus.CONFLICT,
                );
            } else {
                console.log('err: ', error);
                throw error;
            }
        }

        return {
            url,
        };
    }
}
