import { AppError } from '@/domain/errors/AppError';
import { fileMessages } from '@/shared/constants/messages/fileMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { Request, Response, NextFunction } from 'express';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const validateImageUpload = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
        return next(new AppError(fileMessages.ERROR.IMAGE_REQUIRED, HttpStatus.BAD_REQUEST));
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
        return next(new AppError(fileMessages.ERROR.INVALID_TYPE, HttpStatus.BAD_REQUEST));
    }

    if (file.size > MAX_FILE_SIZE) {
        return next(new AppError(fileMessages.ERROR.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST));
    }

    next();
};