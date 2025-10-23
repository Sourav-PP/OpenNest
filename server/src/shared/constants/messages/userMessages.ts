export const userMessages = {
    SUCCESS: {
        REGISTRATION: 'Registration completed successfully',
        PROFILE_UPDATE: 'Profile updated successfully',
        ACCOUNT_ACTIVATED: 'Your account has been reactivated. You can now log in again.',
        ACCOUNT_DEACTIVATED: 'Your account has been deactivated. Please contact support for assistance.',
        USER_STATUS_UPDATED: 'User status updated successfully',
        RATING_SUBMITTED: 'Rating and feedback submitted successfully',
    },
    ERROR: {
        NOT_FOUND: 'User not found',
        PROFILE_IMAGE_REQUIRED: 'Profile image is required',
        UPDATE_FAILED: 'Failed to update user profile',
        BLOCKED_ACCOUNT: 'Your account has been blocked',
        ACCOUNT_ALREADY_ACTIVE: 'Account is already active',
        ACCOUNT_ALREADY_DEACTIVATED: 'Account is already deactivated',
    },
} as const;