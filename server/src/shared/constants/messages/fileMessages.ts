export const fileMessages = {
    ERROR: {
        ALL_REQUIRED: 'All three documents are required: ID, educational, and experience certificates',
        DOCUMENT_NOT_UPLOADED: (label: string) => `${label} document not uploaded`,
        MISSING: (field: string) => `${field} is missing`,
        DOCUMENT_INVALID_TYPE: (field: string) => `Invalid file type for ${field}. Allowed types: JPEG, PNG, PDF.`,

        IMAGE_REQUIRED: 'Image is required',
        INVALID_TYPE: 'Only JPEG, PNG, and WEBP formats are allowed',
        FILE_TOO_LARGE: 'Image must be smaller than 5MB',
    },
} as const;