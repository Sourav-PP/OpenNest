import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import logger from '@/utils/logger';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof Error) {
        logger.error(`Error occurred on ${req.method} ${req.originalUrl}`, {
            message: err.message,
            stack: err.stack,
        });
    } else {
        logger.error(`Unknown error on ${req.method} ${req.originalUrl}`, { err });
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || undefined,
        });
        return;
    }

    //unexpected error
    res.status(500).json({
        success: false,
        message: generalMessages.ERROR.INTERNAL_SERVER_ERROR,
    });
    return;
}
