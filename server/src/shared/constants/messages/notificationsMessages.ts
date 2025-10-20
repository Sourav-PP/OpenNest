export const notificationMessages = {
    SUCCESS: {
        FETCHED_SUCCESSFULLY: 'Fetched all notifications successfully',
        MARKED_AS_READ: 'Notification has been marked as read',
        CANCELED_SUBSCRIPTION_CONSULTATION: 'Your consultation has been cancelled. Your subscription credit has been returned.',
        CANCELED_CONSULTATION: 'Your consultation has been cancelled. Your payment has been refunded to your wallet.',
        CANCELED_CONSULTATION_PSYCHOLOGIST: (patientName: string, reason: string) => `Your consultation with ${patientName}, Reason: ${reason}`,
    },
    ERROR: {
        NOTIFICATION_ID_REQUIRED: 'Notification id is required',
    },
    CONSULTATION: {
        PATIENT_CONSULTATION_REMINDER: 'Your consultation starts in 1 hour',
        PSYCHOLOGIST_CONSULTATION_REMINDER: 'You have a consultation in 1 hour',
    },
} as const;