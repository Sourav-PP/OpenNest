import { Socket } from 'socket.io';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { AppError } from '@/domain/errors/AppError';
import { UserRole } from '@/domain/enums/UserEnums';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';

export const socketAuthMiddleware = (
    jwtService: ITokenService,
    allowedRoles: Array<'user' | 'psychologist' | 'admin'>,
    userRepo: IUserRepository,
) =>
    async(socket: Socket, next: (err?: Error) => void) => {
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

            const user = await userRepo.findById(payload.userId);
            // attach trusted info to socket.data
            socket.data.userId = payload.userId;
            socket.data.role = userRole;
            socket.data.email = payload.email;
            socket.data.name = user?.name || 'participant';

            next();
        } catch (err: unknown) {
            if (err instanceof Error) {
                next(err);
            } else {
                next(new AppError(generalMessages.ERROR.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }
    };
