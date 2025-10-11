import Stripe from 'stripe';
import { IPaymentService } from '../../domain/serviceInterface/IPaymentService';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class PaymentService implements IPaymentService {
    private _stripe: Stripe;

    constructor(stripe: Stripe) {
        this._stripe = stripe;
    }

    async createCheckoutSession(
        amount: number,
        currency: string,
        successUrl: string,
        cancelUrl: string,
        metadata: Record<string, string>,
    ): Promise<{ url: string; sessionId: string }> {
        console.log('metadata in createCheckoutSession: ', metadata);

        if (metadata.purpose === 'subscription') {
            const session = await this._stripe.checkout.sessions.create({
                mode: 'subscription',
                line_items: [
                    {
                        price: metadata.priceId,
                        quantity: 1,
                    },
                ],
                payment_method_types: ['card'],
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata,
            }); 

            if (!session.url) {
                throw new AppError(
                    'We couldn’t generate a payment link at the moment. Please try again in a few minutes.',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
            return {
                sessionId: session.id,
                url: session.url,
            };
        }
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

        if (!session.url) {
            throw new AppError(
                'We couldn’t generate a payment link at the moment. Please try again in a few minutes.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            sessionId: session.id,
            url: session.url,
        };
    }

    async verifyWebhookSignature(
        payload: Buffer,
        signature: string,
        endpointSecret: string,
    ): Promise<Stripe.Event> {
        const event = this._stripe.webhooks.constructEvent(
            payload,
            signature,
            endpointSecret,
        );
        return event;
    }

    async createStripeProductAndPrice(
        name: string,
        description: string,
        amount: number,
        currency: string,
        billingPeriod: 'month' | 'year' | 'week',
    ): Promise<{ priceId: string; productId: string }> {
        const product = await this._stripe.products.create({ name, description });

        const price = await this._stripe.prices.create({
            unit_amount: Math.floor(amount * 100),
            currency,
            recurring: { interval: billingPeriod },
            product: product.id,
        });

        return { priceId: price.id, productId: product.id };
    }

    async cancelSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
        const deletedSubscription = await this._stripe.subscriptions.cancel(stripeSubscriptionId);
        return deletedSubscription;
    }
}
