import Stripe from 'stripe';

export interface IPaymentService {
  createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ): Promise<{ url: string; sessionId: string }>;

  verifyWebhookSignature(
    payload: Buffer,
    signature: string,
    endpointSecret: string,
  ): Promise<Stripe.Event>;

  createStripeProductAndPrice(
    name: string,
    description: string,
    amount: number,
    currency: string,
    billingPeriod: 'month' | 'year' | 'week',
  ): Promise<{ productId: string; priceId: string }>;

  cancelSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription>;
}
