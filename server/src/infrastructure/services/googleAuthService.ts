import { IGoogleAuthService } from '../../domain/serviceInterface/IGoogleAuthService';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleAuthService implements IGoogleAuthService {
    async verifyToken(token: string): Promise<{ email?: string; name?: string; picture?: string; sub: string; } | undefined> {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        return payload;
    }
}