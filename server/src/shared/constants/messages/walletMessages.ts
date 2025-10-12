export const walletMessages = {
    SUCCESS: {
        CREATED: 'Wallet created successfully',
        FETCHED: 'Wallet fetched successfully',
        TRANSACTION_CREATED: 'Transaction created successfully',
        TRANSACTION_FETCHED: 'Transaction fetched successfully',
    },
    ERROR: {
        WALLET_ID_REQUIRED: 'Wallet id is required',
        INSUFFICIENT_FUNDS: 'Insufficient funds', 
        NOT_FOUND: 'Wallet not found',
        PSYCHOLOGIST_WALLET_NOT_FOUND: 'Psychologist wallet not found',
    },
} as const;