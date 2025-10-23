import { ITokenBlacklistService } from '@/domain/serviceInterface/ITokenBlacklistService';
import redisClient from '../redis/redisClient';

export class RedisTokenBlacklistService implements ITokenBlacklistService {
    async blacklistToken(token: string, expiresInSeconds: number): Promise<void> {
        await redisClient.setEx(`blacklistToken:${token}`, expiresInSeconds, 'true');
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const result = await redisClient.get(`blacklistToken:${token}`);
        return result === 'true';
    }

    async blackListUser(userId: string, ttl: number): Promise<void> {
        await redisClient.setEx(`blockedUser:${userId}`, ttl, 'true');
    }

    async removeBlockedUser(userId: string): Promise<void> {
        await redisClient.del(`blockedUser:${userId}`);
    }

    async isUserBlocked(userId: string): Promise<boolean> {
        const result = await redisClient.get(`blockedUser:${userId}`);
        return result === 'true';
    }
}
