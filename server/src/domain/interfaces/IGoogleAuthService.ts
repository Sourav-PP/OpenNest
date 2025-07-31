export interface IGoogleAuthService {
    verifyToken(token: string): Promise<{
        email?: string;
        name?: string;
        picture?: string;
        sub: string;
    } | undefined >
}