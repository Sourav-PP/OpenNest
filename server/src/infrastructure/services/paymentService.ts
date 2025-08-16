import Stripe from 'stripe';
import { IPaymentService } from '../../domain/serviceInterface/IPaymentService';

export class PaymentService implements IPaymentService {
    private _stripe: Stripe;

    constructor(
        stripe: Stripe,
    ) {
        this._stripe = stripe;
    }

    async createCheckoutSession(
        amount: number,
        currency: string,
        successUrl: string,
        cancelUrl: string,
        metadata?: Record<string, string>,
    ): Promise<{ url: string; sessionId: string }> {

        const session = await this._stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: { name: 'Therapy Session' },
                        unit_amount: Math.floor(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata,
        });

        return {
            sessionId: session.id,
            url: session.url!,
        };
    }

    async verifyWebhookSignature(payload: Buffer, signature: string, endpointSecret: string): Promise<Stripe.Event> {
        const event = this._stripe.webhooks.constructEvent(payload, signature, endpointSecret);
        return event;
    }
}
