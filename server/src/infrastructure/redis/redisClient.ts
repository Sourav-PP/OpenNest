import { createClient } from 'redis';
import { appConfig } from '../config/config';
import logger from '@/utils/logger';

const redisClient = createClient({
    socket: {
        host: appConfig.redis.redisHost,
        port: appConfig.redis.redisPort,
    },
    password: appConfig.redis.redisPassword,
});

redisClient.on('error', err => logger.error('Redis Error', err));

export const connectRedis = async() => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('connected to redis cloud');
    }
};

export default redisClient;