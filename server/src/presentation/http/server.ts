import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { appConfig } from '@/infrastructure/config/config';

//routes
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import psychologistRoutes from './routes/psychologistRoutes';

const app = express();

app.use(cors({
    origin: appConfig.cors.origins,
    credentials: true,
}));

app.use((req, res, next) => {
    if (req.originalUrl === '/api/user/payment/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(cookieParser());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes );
app.use('/api/user', userRoutes);
app.use('/api/psychologist', psychologistRoutes);

app.use(errorHandler as ErrorRequestHandler);

export { app };