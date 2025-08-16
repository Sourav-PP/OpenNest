import mongoose from 'mongoose';
import { appConfig } from '../config/config';

export async function connectDB() {
    try {
        await mongoose.connect(`${appConfig.db.url}/opennest`);
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}