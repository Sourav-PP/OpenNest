import jwt from 'jsonwebtoken'
import { ITokenService } from '../../domain/interfaces/ITokenService'

export class JwtTokenService implements ITokenService {
    private accessTokenSecret: string
    private refreshTokenSecret: string

    constructor() {
        this.accessTokenSecret =process.env.ACCESS_TOKEN_SECRET || '';
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
    }

    generateAccessToken(userId: string, role: string, email: string): string {
        return jwt.sign({ userId, role, email }, this.accessTokenSecret, { expiresIn: '15m' })
    }

    generateRefreshToken(userId: string, role: string, email: string): string {
        return jwt.sign({ userId, role, email }, this.refreshTokenSecret, { expiresIn: '7d' })
    }

    verifyRefreshToken(token: string): { userId: string; role: string; email: string } | null {
        try {
            console.log("refresh token verified")
            return jwt.verify(token, this.refreshTokenSecret) as { userId: string, role: string, email: string}
        } catch (error) {
            return null
        }
    }

    verifyAccessToken(token: string): { userId: string; email: string; role: string; } | null {
        try {
    
            return jwt.verify(token, this.accessTokenSecret) as { userId: string, role: string, email: string}

        } catch (error) {
            console.log('JWT verify error: ', error)
            return null
        }
    }
}