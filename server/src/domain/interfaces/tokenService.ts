export interface TokenService {
    generateAccessToken(userId: string, role: string): string;
    generateRefreshToken(userId: string, role: string): string;
    verifyRefreshToken(token: string): { userId: string; role: string } | null
}