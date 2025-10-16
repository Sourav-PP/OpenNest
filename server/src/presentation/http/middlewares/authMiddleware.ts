import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ITokenService } from '../../../domain/serviceInterface/ITokenService';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { AppError } from '@/domain/errors/AppError';
import { UserRole } from '@/domain/enums/UserEnums';

export const authMiddleware = (jwtService: ITokenService, allowedRoles: Array<'user' | 'psychologist' | 'admin'>): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new AppError(authMessages.ERROR.NO_TOKEN_PROVIDED, HttpStatus.UNAUTHORIZED);
            }

            const token = authHeader.split(' ')[1];
            const payload = jwtService.verifyAccessToken(token);

            if (!payload || !payload.userId || !payload.email || !payload.role) {
                throw new AppError(authMessages.ERROR.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
            }

            const userRole = payload.role as UserRole;

            if (!allowedRoles.includes(userRole)) {
                throw new AppError(authMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
            }

            // check if user is blocked
            if (payload.isActive === false) {
                throw new AppError(authMessages.ERROR.BLOCKED_USER, HttpStatus.FORBIDDEN);
            }

            req.user = {
                userId: payload.userId,
                email: payload.email,
                role: userRole,
                isActive: payload.isActive,
            };

            next();
        } catch (err) {
            const error = err as any;
            if (error.name === 'TokenExpiredError') {
                return next(new AppError(authMessages.ERROR.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED));
            }
            next(err);
        }
    };
