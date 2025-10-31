export const chatMessages = {
    SUCCESS: {
        SENT: 'Message sent successfully',
        HISTORY_FETCHED: 'Chat history fetched successfully',
        UNREAD_COUNT_FETCHED: 'Unread message count fetched successfully',
        MARKED_AS_READ: 'Message successfully marked as read',
        FETCHED_CONSULTATIONS: 'Consultations fetched successfully',
        FILE_UPLOADED: 'File uploaded successfully',
    },
    ERROR: {
        NOT_FOUND: 'Message not found',
        ALREADY_DELETED: 'Message is already deleted',
        INVALID_ROOM_ID: 'Invalid roomId',
        INVALID_CONSULTATION_ID: 'Invalid consultation Id',
        INVALID_MESSAGEID_OR_CONSULTATION_ID: 'Invalid message id or consultation id',
        NO_FILE_PROVIDED: 'No file provided',
        NOT_PAID: 'Chat not available until payment is completed',
        EMPTY_MESSAGE: 'Message must contain text or media',
        MESSAGE_FAILED: 'Message failed',
    },
} as const;