export const bookingMessages = {
    SUCCESS: {
        WEBHOOK_PROCESSED: 'Stripe webhook processed successfully',
        CHECKOUT_SESSION_CREATED: 'Checkout session created successfully',
        PAYMENT_SUCCESS: 'Payment completed successfully',
        BOOKING_CONFIRMED: 'Booking confirmed successfully',
    },
    ERROR: {
        BOOKING_ONLY_AFTER_ONE_MONTH: 'You can only book another session after one month from your last session.',
        MISSING_METADATA: 'Missing required booking metadata',
        PAYMENT_NOT_FOUND: 'Payment not found for the session ID',
        SLOT_NOT_AVAILABLE: 'Selected slot is no longer available',
        SLOT_JUST_BOOKED: 'Sorry, this slot has just been booked by someone else.',
        CONSULTATION_EXISTS: 'Consultation already exists for this payment',
        CONSULTATION_NOT_FOUND: 'Consultation not found',
        CONSULTATION_ID_REQUIRED: 'Consultation id is required',
        MISSING_FIELDS: 'Missing required payment details',
        PAYMENT_FAILED: 'Payment failed, please try again',
        SLOT_ALREADY_BOOKED: 'Selected slot is already booked',
        MISSING_SIGNATURE: 'Stripe signature header is missing',
        BOOKING_NOT_FOUND: 'Booking not found',
        ONLY_BOOKED_CANCEL: 'Only booked consultation can be canceled',
    },
} as const;