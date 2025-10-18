export interface ITokenBlacklistService {
    blacklistToken(token: string, expiresInSeconds: number): Promise<void>;
    isTokenBlacklisted(token: string): Promise<boolean>;
    blackListUser(userId: string, ttl: number): Promise<void>;
    removeBlockedUser(userId: string): Promise<void>;
    isUserBlocked(userId: string): Promise<boolean>;
}
