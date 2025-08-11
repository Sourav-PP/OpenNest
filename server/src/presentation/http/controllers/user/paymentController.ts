import { Request, Response } from "express";
import { ICreateCheckoutSessionUseCase } from "../../../../useCases/interfaces/user/payment/ICreateCheckoutSessionUseCase";
import { IHandleWebhookUseCase } from "../../../../useCases/interfaces/user/payment/IHandleWebhookUseCase";
import { AppError } from "../../../../domain/errors/AppError";
import { ISlotRepository } from "../../../../domain/interfaces/ISlotRepository";

export class PaymentController {
    constructor(
        private createCheckoutSessionUseCase: ICreateCheckoutSessionUseCase,
        private handleWebhookUseCase: IHandleWebhookUseCase,
        private slotRepo: ISlotRepository
    ) {}

    createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("heree in createchecoutsession controller")
            const {slotId, sessionGoal, amount} = req.body
            const userId = req.user?.userId

            if(!userId) {
                res.status(401).json({success: false, message:"unauthorized user"})
                return
            }

            if (!slotId || !sessionGoal || !amount) {
                res.status(400).json({ success: false, message: "Missing required fields" });
                return;
            }

            const slot = await this.slotRepo.findById(slotId)

            if(!slot) {
                res.status(409).json({success: false, message: "Slot not found"})
                return
            }

            if(slot.isBooked) {
                res.status(404).json({success: false, message: "Slot is already booked"})
                return
            }

            const result = await this.createCheckoutSessionUseCase.execute({
                userId,
                psychologistId: slot.psychologistId,
                slotId,
                amount,
                sessionGoal
            })

            res.status(200).json({success: true, url: result.url})
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }

    handleWebhook = async (req: Request, res: Response): Promise<void> => {
        try {
            const payload = req.body
            const signature = req.headers["stripe-signature"] as string;
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

            if (!signature) {
                res.status(400).json({ success: false, message: "Missing Stripe signature" });
                return;
            }

            await this.handleWebhookUseCase.execute(Buffer.from(payload),signature, endpointSecret)

            res.status(200).json({ success: true, message: "Webhook processed" });
        } catch (error: any) {
            console.error("Webhook error:", error);
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}