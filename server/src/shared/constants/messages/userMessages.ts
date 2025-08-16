export const userMessages = {
    SUCCESS: {
        REGISTRATION: 'Registration completed successfully',
        PROFILE_UPDATE: 'Profile updated successfully',
        ACCOUNT_ACTIVATED: 'Account activated successfully',
        ACCOUNT_DEACTIVATED: 'Account deactivated successfully',
        USER_STATUS_UPDATED: 'User status updated successfully',
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