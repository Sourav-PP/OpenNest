import { Request, Response, NextFunction, RequestHandler } from 'express';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export const checkBlockedMiddleware = (userRepository: IUserRepository): RequestHandler =>
    async(req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
            }

            const isBlocked = await userRepository.isUserBlocked(req.user.userId);

            if (isBlocked) {
                throw new AppError(authMessages.ERROR.BLOCKED_USER, HttpStatus.FORBIDDEN);
 
            }
            next();
        } catch (error) {
            next(error);
        }
    };
