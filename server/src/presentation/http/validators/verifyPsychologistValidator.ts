import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';

export const verifyPsychologistValidator = [
    body('qualification')
        .isString()
        .withMessage('Qualification must be string')
        .trim()
        .notEmpty()
        .withMessage('Qualification is required'),
    body('specializations')
        .isArray({ min: 1 })
        .withMessage('At least one specialization must be selected'),
    body('aboutMe')
        .isString()
        .trim()
        .isLength({ max: 300 })
        .notEmpty()
        .withMessage('aboutMe is required'),
    body('defaultFee')
        .isNumeric()
        .withMessage('Default Fees must be a number')
        .custom((value) => value >= 0)
        .withMessage('Default Fees must be a non-negative number'),
];

export const validateVerifyPsychologist = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Format errors as an array of { field, message }
        const formattedErrors = errors.array().map(err => ({
            field: (err as any).path,
            message: err.msg,
        }));
        throw new AppError('Validation failed', HttpStatus.BAD_REQUEST, true, formattedErrors);
    }
    next();
};
