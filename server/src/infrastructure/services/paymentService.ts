import Stripe from "stripe";
import { IPaymentService } from "../../domain/services/IPaymentService";

export class PaymentService implements IPaymentService {
  constructor(
    private stripe: Stripe
  ) {}

  async createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ): Promise<{ url: string; sessionId: string }> {

    const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {name: "Therapy Session"},
                    unit_amount: Math.floor(amount * 100)
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
    })

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  async verifyWeebhookSignature(payload: Buffer, signature: string, endpointSecret: string): Promise<Stripe.Event> {
    try {    
      const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return event;
  } catch (err: any) {
      console.error("Signature verification failed:", err.message);
      throw err;
  }
  }
}
