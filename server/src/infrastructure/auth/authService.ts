import bcrypt from 'bcrypt'
import { AuthService } from '../../domain/interfaces/authService'   

export class BcryptAuthService implements AuthService {
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10)
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash)
    }
}