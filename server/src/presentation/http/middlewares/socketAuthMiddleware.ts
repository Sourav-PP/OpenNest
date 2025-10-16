import { Socket } from 'socket.io';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { AppError } from '@/domain/errors/AppError';
import { UserRole } from '@/domain/enums/UserEnums';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';

export const socketAuthMiddleware = (jwtService: ITokenService, allowedRoles: Array<'user' | 'psychologist' | 'admin'>) =>
    (socket: Socket, next: (err?: any) => void) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) throw new AppError(generalMessages.ERROR.NO_TOKEN);

            const payload = jwtService.verifyAccessToken(token);
            if (!payload || !payload.userId || !payload.role || !payload.email) {
                throw new Error(generalMessages.ERROR.INVALID_TOKEN);
            }

            const userRole = payload.role as UserRole;

            if (!allowedRoles.includes(userRole)) {
                throw new Error(authMessages.ERROR.FORBIDDEN);
            }

            // attach trusted info to socket.data
            socket.data.userId = payload.userId;
            socket.data.role = userRole;
            socket.data.email = payload.email;

            next();
        } catch (err) {
            next(err); 
        }
    };
