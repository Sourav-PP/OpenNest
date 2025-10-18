// src/middlewares/notFoundHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { generalMessages } from '@/shared/constants/messages/generalMessages';

export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
    next(new AppError(generalMessages.ERROR.ROUTE_NOT_FOUND, 404));
}
