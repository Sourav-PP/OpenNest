import bcrypt from 'bcrypt';
import { IAuthService } from '../../domain/serviceInterface/IAuthService';

export class BcryptAuthService implements IAuthService {
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
    /**
     *
     * @param password
     * @param hash
     * @returns
     */
    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
