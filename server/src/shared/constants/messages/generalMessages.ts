export const generalMessages = {
    SUCCESS: {
        OPERATION_SUCCESS: 'Operation completed successfully',
    },
    ERROR: {
        INVALID_STATUS: 'Invalid status value',
        INTERNAL_SERVER_ERROR: 'Something went wrong, please try again later',
        BAD_REQUEST: 'Invalid request parameters',
        NOT_FOUND: 'Resource not found',
        FORBIDDEN: 'You do not have permission to perform this action',
        CONFLICT: 'Conflict occurred, please check your request',
    },
    INFO: {
        PROCESSING: 'Your request is being processed',
        NO_DATA: 'No data found',
    },
} as const;