export const chatMessages = {
    SUCCESS: {
        SENT: 'Message sent successfully',
        HISTORY_FETCHED: 'Chat history fetched successfully',
    },
    ERROR: {
        NOT_PAID: 'Chat not available until payment is completed',
        EMPTY_MESSAGE: 'Message must contain text or media',
        MESSAGE_FAILED: 'Message failed',
    },
} as const;