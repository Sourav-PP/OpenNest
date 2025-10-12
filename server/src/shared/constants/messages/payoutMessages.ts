export const payoutMessages = {
    SUCCESS: {
        PAYOUT_REQUEST_CREATED: 'Payout request created successfully',
        PAYOUTS_FETCHED: 'Payout fetched successfully',
        APPROVED: 'Payout request approved successfully',
        REJECTED: 'Payout request rejected successfully',
        FETCHED_PENDING_AMOUNT: 'Pending amount fetched successfully',  
    },
    ERROR: {
        NO_ELIGIBLE_CONSULTATIONS: 'No eligible consultations found for payout request',
        PAYOUT_REQUEST_FAILED: 'Failed to create payout request. Please try again later.',
        INVALID_PAYOUT_AMOUNT: 'Calculated payout amount is invalid.',
        NOT_FOUND: 'Payout request not found',
        NOT_PENDING: 'Payout request is not pending',
        CONSULTATION_ALREADY_INCLUDED_IN_PAYOUT: 'One or more consultation is already included in payout',
        REJECT_ONLY_PENDING: 'Only pending request can be rejected',
    },
} as const;