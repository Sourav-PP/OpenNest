export const generalMessages = {
  SUCCESS: {
    OPERATION_SUCCESS: 'Operation completed successfully',
  },
  ERROR: {
    INVALID_STATUS: 'Invalid status value',
    INVALID_INPUT: 'Invalid input data',
    MISSING_PARAMETERS: 'Required parameters are missing',
    INTERNAL_SERVER_ERROR: 'Something went wrong, please try again later',
    BAD_REQUEST: 'Invalid request parameters',
    NOT_FOUND: 'Resource not found',
    FORBIDDEN: 'You do not have permission to perform this action',
    CONFLICT: 'Conflict occurred, please check your request',
    INVALID_TOKEN: 'Token is invalid',
    NO_TOKEN: 'No token is provided',
  },
  INFO: {
    PROCESSING: 'Your request is being processed',
    NO_DATA: 'No data found',
  },
} as const;
