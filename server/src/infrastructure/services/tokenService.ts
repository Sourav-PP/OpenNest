import jwt from 'jsonwebtoken';
import { ITokenService } from '../../domain/serviceInterface/ITokenService';

export class JwtTokenService implements ITokenService {
    private _accessTokenSecret: string;
    private _refreshTokenSecret: string;
    private _generateSignupTokenSecret: string;

    constructor() {
        this._accessTokenSecret =process.env.ACCESS_TOKEN_SECRET || '';
        this._refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || '';
        this._generateSignupTokenSecret = process.env.SIGNUP_TOKEN_SECRET || '';
    }

    generateAccessToken(userId: string, role: string, email: string): string {
        return jwt.sign({ userId, role, email }, this._accessTokenSecret, { expiresIn: '15m' });
    }

    generateRefreshToken(userId: string, role: string, email: string): string {
        return jwt.sign({ userId, role, email }, this._refreshTokenSecret, { expiresIn: '7d' });
    }

    verifyRefreshToken(token: string): { userId: string; role: string; email: string } | null {
        try {
            console.log('refresh token verified');
            return jwt.verify(token, this._refreshTokenSecret) as { userId: string, role: string, email: string};
        } catch (error) {
            return null;
        }
    }

    verifyAccessToken(token: string): { userId: string; email: string; role: string; } | null {
        try {
    
            return jwt.verify(token, this._accessTokenSecret) as { userId: string, role: string, email: string};

        } catch (error) {
            console.log('JWT verify error: ', error);
            return null;
        }
    }

    generateSignupToken(email: string): string {
        return jwt.sign({ email }, this._generateSignupTokenSecret, { expiresIn: '10m' });
    }

    verifySignupToken(token: string): { email: string; } | null {
        try {
            return jwt.verify(token, this._generateSignupTokenSecret) as {email: string};
        } catch (error) {
            console.log('JWT verify signup token error: ', error);
            return null;
        }
    }
}