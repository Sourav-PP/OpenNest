import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { generalMessages } from '@/shared/constants/messages/generalMessages';

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    console.error('Error occurred:', err);

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
