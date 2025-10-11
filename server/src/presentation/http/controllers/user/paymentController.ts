import { NextFunction, Request, Response } from 'express';
import { ICreateCheckoutSessionUseCase } from '@/useCases/interfaces/user/payment/ICreateCheckoutSessionUseCase';
import { IHandleWebhookUseCase } from '@/useCases/interfaces/user/payment/IHandleWebhookUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { appConfig } from '@/infrastructure/config/config';
import { ICreateSubscriptionCheckoutSessionUseCase } from '@/useCases/interfaces/subscription/ICreateSubscriptionCheckoutSessionUseCase';
import { IBookConsultationWithSubscriptionUseCase } from '@/useCases/interfaces/subscription/IBookConsultationWithSubscriptionUseCase';

export class PaymentController {
    private _createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase;
    private _handleWebhookUseCase: IHandleWebhookUseCase;
    private _createSubscriptionCheckoutSessionUseCase: ICreateSubscriptionCheckoutSessionUseCase;
    private _bookConsultationWithSubscriptionUseCase: IBookConsultationWithSubscriptionUseCase;

    constructor(
        createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
        handleWebhookUseCase: IHandleWebhookUseCase,
        createSubscriptionCheckoutSessionUseCase: ICreateSubscriptionCheckoutSessionUseCase,
        bookConsultationWithSubscriptionUseCase: IBookConsultationWithSubscriptionUseCase,
    ) {
        this._createCheckoutSessionUseCase = createCheckoutSessionUseCase;
        this._handleWebhookUseCase = handleWebhookUseCase;
        this._createSubscriptionCheckoutSessionUseCase = createSubscriptionCheckoutSessionUseCase;
        this._bookConsultationWithSubscriptionUseCase = bookConsultationWithSubscriptionUseCase;
    }

    // normal consultation payment session
    createCheckoutSession = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const { slotId, sessionGoal, amount, purpose } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (!purpose || !amount) {
                console.log('problem is here..');

                throw new AppError(
                    bookingMessages.ERROR.MISSING_FIELDS,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (purpose === 'consultation' && (!slotId || !sessionGoal)) {
                console.log('problem is here');
                throw new AppError(
                    bookingMessages.ERROR.MISSING_FIELDS,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const result = await this._createCheckoutSessionUseCase.execute({
                userId,
                slotId,
                amount,
                sessionGoal,
                purpose,
            });

            res.status(HttpStatus.OK).json({
                success: true,
                message: bookingMessages.SUCCESS.CHECKOUT_SESSION_CREATED,
                data: {
                    url: result.url,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    createSubscriptionCheckoutSession = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            console.log('create subscription checkout session controller triggered');
            const { planId, psychologistId } = req.body;
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }
            
            if (!planId) {
                throw new AppError(
                    bookingMessages.ERROR.MISSING_FIELDS,
                    HttpStatus.BAD_REQUEST,
                );
            }

            if (!psychologistId) {
                throw new AppError(
                    bookingMessages.ERROR.MISSING_FIELDS,
                    HttpStatus.BAD_REQUEST,
                );
            }

            const url = await this._createSubscriptionCheckoutSessionUseCase.execute(
                userId,
                planId,
                psychologistId,
            );
            res.status(HttpStatus.OK).json({
                success: true,
                message: bookingMessages.SUCCESS.CHECKOUT_SESSION_CREATED,
                data: {
                    url,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    bookConsultationWithSubscription = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {   
            const { subscriptionId, slotId, sessionGoal } = req.body;
            console.log('book consultation with subscription controller triggered');
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError(
                    authMessages.ERROR.UNAUTHORIZED,
                    HttpStatus.UNAUTHORIZED,
                );
            }
            if (!subscriptionId || !slotId || !sessionGoal) {
                throw new AppError(
                    bookingMessages.ERROR.MISSING_FIELDS,
                    HttpStatus.BAD_REQUEST,
                );
            }
            const { consultation, subscription } = await this._bookConsultationWithSubscriptionUseCase.execute(
                userId,
                subscriptionId,
                slotId,
                sessionGoal,
            );
            
            res.status(HttpStatus.OK).json({
                success: true,
                message: bookingMessages.SUCCESS.BOOKING_CONFIRMED,
                data: {
                    consultation,
                    subscription,
                },
            });
        } catch (error) {
            next(error);
        }
    };
        
    handleWebhook = async(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            console.log('webhook controller triggered');
            const payload = req.body;
            const signature = req.headers['stripe-signature'] as string;
            const endpointSecret = appConfig.stripe.webhookSecret;

            if (!signature) {
                throw new AppError(
                    bookingMessages.ERROR.MISSING_SIGNATURE,
                    HttpStatus.BAD_REQUEST,
                );
            }

            await this._handleWebhookUseCase.execute(
                Buffer.from(payload),
                signature,
                endpointSecret,
            );

            res.status(200).json({
                success: true,
                message: bookingMessages.SUCCESS.WEBHOOK_PROCESSED,
            });
        } catch (error) {
            next(error);
        }
    };
}
