export interface ITokenService {
    generateAccessToken(userId: string, role: string, email: string): string;
    generateRefreshToken(userId: string, role: string, email: string): string;
    verifyAccessToken(token: string): { userId: string, email: string, role: string } | null
    verifyRefreshToken(token: string): { userId: string, email: string, role: string } | null
}