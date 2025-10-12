import dotenv from 'dotenv';
dotenv.config();

function required(name: string, value?: string): string {
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export const appConfig = {
    server: {
        port: Number(process.env.PORT) || 5000,
        nodeEnv: process.env.NODE_ENV || 'development',
        frontendUrl: required('FRONTEND_URL', process.env.FRONTEND_URL),
    },

    cors: {
        origin: process.env.FRONTEND_URLS?.split(',') || 'http://localhost:5173',
    },

    jwt: {
        accessTokenSecret: required(
            'ACCESS_TOKEN_SECRET',
            process.env.ACCESS_TOKEN_SECRET,
        ),
        refreshTokenSecret: required(
            'REFRESH_TOKEN_SECRET',
            process.env.REFRESH_TOKEN_SECRET,
        ),
        signupTokenSecret: required(
            'SIGNUP_TOKEN_SECRET',
            process.env.SIGNUP_TOKEN_SECRET,
        ),
    },

    db: {
        url: required('MONGODB_URI', process.env.MONGODB_URI),
    },

    nodemailer: {
        emailHost: required('EMAIL_HOST', process.env.EMAIL_HOST),
        emailPort: Number(process.env.EMAIL_PORT) || 587,
        emailUser: required('EMAIL_USER', process.env.EMAIL_USER),
        emailPassword: required('EMAIL_PASS', process.env.EMAIL_PASS),
    },

    cloudinary: {
        cloudName: required(
            'CLOUDINARY_CLOUD_NAME',
            process.env.CLOUDINARY_CLOUD_NAME,
        ),
        apiKey: required('CLOUDINARY_API_KEY', process.env.CLOUDINARY_API_KEY),
        apiSecret: required(
            'CLOUDINARY_API_SECRET',
            process.env.CLOUDINARY_API_SECRET,
        ),
    },

    google: {
        clientId: required('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID),
    },

    stripe: {
        secretKey: required('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
        webhookSecret: required(
            'STRIPE_WEBHOOK_SECRET',
            process.env.STRIPE_WEBHOOK_SECRET,
        ),
        currency: process.env.CURRENCY || 'usd',
        frontendSuccessUrl: required(
            'FRONTEND_SUCCESS_URL',
            process.env.FRONTEND_SUCCESS_URL,
        ),
        frontendCancelUrl: required(
            'FRONTEND_CANCEL_URL',
            process.env.FRONTEND_CANCEL_URL,
        ),
        commissionPercentage: Number(process.env.COMMISSION_PERCENTAGE) || 20,
    },
};
