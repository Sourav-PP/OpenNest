export interface ITokenService {
    generateAccessToken(userId: string, role: string, email: string, isActive: boolean): string;
    generateRefreshToken(userId: string, role: string, email: string, isActive: boolean): string;
    verifyAccessToken(token: string): { userId: string; email: string; role: string; isActive: boolean; exp: number } | null;
    verifyRefreshToken(token: string): { userId: string; email: string; role: string; isActive: boolean } | null;
    generateSignupToken(email: string): string;
    verifySignupToken(token: string): { email: string } | null;
}
