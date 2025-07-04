import jwt from 'jsonwebtoken'
import { TokenService } from '../../domain/interfaces/tokenService'

export class JwtTokenService implements TokenService {
    private accessTokenSecret: string
    private refreshTokenSecret: string

    constructor() {
        this.accessTokenSecret =process.env.ACCESS_TOKEN_SECRET || '';
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
    }

    generateAccessToken(userId: string, role: string): string {
        console.log('hi token is:', this.accessTokenSecret)
        return jwt.sign({ userId, role }, this.accessTokenSecret, { expiresIn: '15m' })
    }

    generateRefreshToken(userId: string, role: string): string {
        return jwt.sign({ userId, role }, this.refreshTokenSecret, { expiresIn: '7d' })
    }

    verifyRefreshToken(token: string): { userId: string; role: string; } | null {
        try {
            return jwt.verify(token, this.refreshTokenSecret) as { userId: string, role: string}
        } catch (error) {
            return null
        }
    }
}