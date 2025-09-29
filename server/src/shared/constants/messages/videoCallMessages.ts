export const videoCallMessages = {
    SUCCESS: {
        SCHEDULED: 'Video call scheduled successfully',
        STARTED: 'Video call has been started',
        ENDED: 'Video call has been ended', 
    },
    ERROR: {
        NOT_FOUND: 'Video call not found',
        NOT_SCHEDULED: 'Video call is not scheduled',
        NOT_ACTIVE: 'Video call is not active',
        UNAUTHORIZED: 'Unauthorized for this consultation',
        SESSION_NOT_STARTED: 'Your session hasn’t started yet. You can join the call 5 minutes before the scheduled time.',
        SESSION_ENDED: 'This session has already ended. Please check your consultation history for details.',   
    },
} as const;