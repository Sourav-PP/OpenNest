export const adminMessages = {
    SUCCESS: {
        KYC_APPROVED: 'KYC approved successfully',
        KYC_REJECTED: 'KYC rejected successfully',
        SERVICE_CREATED: 'Service created successfully',
    },
    ERROR: {
        PSYCHOLOGIST_ID_REQUIRED: 'Psychologist ID is required',
        USER_ID_REQUIRED: 'User ID is required',
        PSYCHOLOGIST_NOT_FOUND: 'Psychologist not found',
        SERVICE_BANNER_REQUIRED: 'Service banner image is required',
        KYC_REASON_REQUIRED: 'Reason is required to reject the KYC',
        KYC_NOT_FOUND: 'No KYC record found for the specified psychologist',
        SERVICE_ALREADY_EXISTS: 'Service with this name already exists',
    },
} as const;
