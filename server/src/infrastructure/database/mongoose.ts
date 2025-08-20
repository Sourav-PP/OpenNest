import mongoose from 'mongoose';
import { appConfig } from '../config/config';
import { PaymentModel } from './models/user/Payment';
import logger from '@/utils/logger';

export async function connectDB() {
    try {
        await mongoose.connect(`${appConfig.db.url}/opennest`);
        logger.info('Database connected');

        await PaymentModel.createIndexes();

    } catch (error) {
        logger.error('Database connection error:', error);
        process.exit(1);
    }
}