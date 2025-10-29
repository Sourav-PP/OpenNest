import { AppError } from '@/domain/errors/AppError';
import { fileMessages } from '@/shared/constants/messages/fileMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { Request, Response, NextFunction } from 'express';

export const validateFiles = (req: Request, res: Response, next: NextFunction): void => {
    const files = req.files as {
    identificationDoc?: Express.Multer.File[],
    educationalCertification?: Express.Multer.File[],
    experienceCertificate?: Express.Multer.File[]
  };

    if (
        !files?.identificationDoc?.[0] ||
        !files?.educationalCertification?.[0] ||
        !files?.experienceCertificate?.[0]
    ) {
        return next(new AppError(fileMessages.ERROR.ALL_REQUIRED, HttpStatus.BAD_REQUEST));
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    for (const field of ['identificationDoc', 'educationalCertification', 'experienceCertificate']) {

        const fileArray = files[field as keyof typeof files]; // fileArray: Express.Multer.File[] | undefined

        if (!fileArray || fileArray.length === 0) {
            return next(new AppError(fileMessages.ERROR.MISSING(field), HttpStatus.BAD_REQUEST));
        }
        const file = fileArray[0];
        if (!allowedTypes.includes(file.mimetype)) {
            return next(new AppError(fileMessages.ERROR.DOCUMENT_INVALID_TYPE(field), HttpStatus.BAD_REQUEST));
        }

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            return next(new AppError(fileMessages.ERROR.FILE_TOO_LARGE, HttpStatus.BAD_REQUEST));
        }
    }

    next();
};
