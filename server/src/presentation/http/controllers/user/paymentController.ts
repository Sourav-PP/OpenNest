import { NextFunction, Request, Response } from 'express';
import { ICreateCheckoutSessionUseCase } from '@/useCases/interfaces/user/payment/ICreateCheckoutSessionUseCase';
import { IHandleWebhookUseCase } from '@/useCases/interfaces/user/payment/IHandleWebhookUseCase';
import { AppError } from '@/domain/errors/AppError';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { appConfig } from '@/infrastructure/config/config';

export class PaymentController {
    private _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase;
    private _handleWebhookUseCase: IHandleWebhookUseCase;
    private _slotRepo: ISlotRepository;

    constructor(
        createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
        handleWebhookUseCase: IHandleWebhookUseCase,
        slotRepo: ISlotRepository,
    ) {
        this._createCheckoutSessionUseCase = createCheckoutSessionUseCase;
        this._handleWebhookUseCase = handleWebhookUseCase;
        this._slotRepo = slotRepo;
    }

    createCheckoutSession = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { slotId, sessionGoal, amount } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            if (!slotId || !sessionGoal || !amount) {
                throw new AppError(bookingMessages.ERROR.MISSING_FIELDS, HttpStatus.BAD_REQUEST);
            }

            const slot = await this._slotRepo.findById(slotId);

            if (!slot) {
                throw new AppError(bookingMessages.ERROR.SLOT_NOT_AVAILABLE, HttpStatus.NOT_FOUND);
            }

            if (slot.isBooked) {
                throw new AppError(bookingMessages.ERROR.SLOT_ALREADY_BOOKED, HttpStatus.CONFLICT);
            }

            const result = await this._createCheckoutSessionUseCase.execute({
                userId,
                psychologistId: slot.psychologistId,
                slotId,
                amount,
                sessionGoal,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                url: result.url,
            });
        } catch (error) {
            next(error);
        }
    };

    handleWebhook = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const payload = req.body;
            const signature = req.headers['stripe-signature'] as string;
            const endpointSecret = appConfig.stripe.webhookSecret;

            if (!signature) {
                throw new AppError(bookingMessages.ERROR.MISSING_SIGNATURE, HttpStatus.BAD_REQUEST);
            }

            await this._handleWebhookUseCase.execute(Buffer.from(payload),signature, endpointSecret);

            res.status(200).json({
                success: true,
                message: bookingMessages.SUCCESS.WEBHOOK_PROCESSED,
            });
        } catch (error) {
            next(error);
        }
    };
}