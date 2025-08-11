import { ICreateCheckoutSessionUseCase } from "../../../interfaces/user/payment/ICreateCheckoutSessionUseCase";
import { ICreateCheckoutSessionInput, ICreateCheckoutSessionOutput } from "../../../types/payment";
import { IPaymentService } from "../../../../domain/services/IPaymentService";
import { IPaymentRepository } from "../../../../domain/interfaces/IPaymentRepository";
import { ISlotRepository } from "../../../../domain/interfaces/ISlotRepository";
import { AppError } from "../../../../domain/errors/AppError";
import { Payment } from "../../../../domain/entities/payment";

export class CreateCheckoutSessionUseCase implements ICreateCheckoutSessionUseCase {
    constructor(
        private paymentService: IPaymentService,
        private paymentRepository: IPaymentRepository,
        private slotRepo: ISlotRepository
    ){}
    async execute(input: ICreateCheckoutSessionInput): Promise<ICreateCheckoutSessionOutput> {
        if(!input.userId) {
            throw new AppError("Missing required userId", 400)
        }
        const slot = await this.slotRepo.findById(input.slotId)
        if(!slot) {
            throw new AppError("Slot not available", 404)
        }

        const currency = process.env.CURRENCY || 'usd'
        const successUrl = process.env.FRONTEND_SUCCESS_URL!
        const cancelUrl = process.env.FRONTEND_CANCEL_URL!

        console.log("currency", currency)
        console.log('successurl:', successUrl)
        console.log('cancelurl', cancelUrl)

        console.log('slot starttimedate when passing to metadata: ', slot.startDateTime)
        console.log('slot enddate time when passint to metadata', slot.endDateTime)

        const metadata:{
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
        }

        if (input.subscriptionId) {
            metadata.subscriptionId = input.subscriptionId;
        }

        console.log("metadata: ", metadata)

        const {url, sessionId} = await this.paymentService.createCheckoutSession(input.amount,currency, `${successUrl}?session_id={CHECKOUT_SESSION_ID}`, cancelUrl, metadata )
    
        console.log('its here:',sessionId)
        const payment: Payment = {
            userId: input.userId,
            amount: input.amount,
            currency: process.env.CURRENCY || "usd",
            paymentMethod: "stripe",
            paymentStatus: "pending",
            refunded: false,
            transactionId: undefined,
            stripeSessionId: sessionId,
        };

        await this.paymentRepository.create(payment)
        

        console.log('checkout session created!')

        return {
            url: url,
        };
    }
}