export const sessionMessages = {
    SUCCESS: {
        BOOKED: 'Session booked successfully',
        CANCELLED: 'Session cancelled successfully',
        COMPLETED: 'Session marked as completed',
    },
    ERROR: {
        NOT_FOUND: 'Session not found',
        CANNOT_CANCEL: 'Cannot cancel this session',
        ALREADY_COMPLETED: 'Session already completed',
        BOOKING_CONFLICT: 'Session booking conflict',
    },

} as const;