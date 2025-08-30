import { Socket } from 'socket.io';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { AppError } from '@/domain/errors/AppError';

export const socketAuthMiddleware = (jwtService: ITokenService, allowedRoles: Array<'user'|'psychologist'|'admin'>) => (socket: Socket, next: (err?: any) => void) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) throw new AppError('No token provided');

        const payload = jwtService.verifyAccessToken(token);
        if (!payload || !payload.userId || !payload.role || !payload.email) {
            throw new Error('Invalid token');
        }

        const userRole = payload.role as 'user'|'psychologist'|'admin';
        if (!allowedRoles.includes(userRole)) {
            throw new Error('Forbidden');
        }

        // attach trusted info to socket.data
        socket.data.userId = payload.userId;
        socket.data.role = userRole;
        socket.data.email = payload.email;

        next();
    } catch (err) {
        next(err); // disconnects unauthorized socket
    }
};
