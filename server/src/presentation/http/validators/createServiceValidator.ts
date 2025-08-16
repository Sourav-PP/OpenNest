import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';

export const createServiceValidator = [
    body('name')
        .isString()
        .withMessage('name must be string')
        .trim()
        .notEmpty()
        .withMessage('name is required'),
    body('description')
        .isString()
        .withMessage('description must be string')
        .trim()
        .notEmpty()
        .withMessage('description is required')
        .isLength({ max: 1000 })
        .withMessage('description must be at most 1000 characters'),
];

export const validateCreateService = (req: Request, res: Response, next: NextFunction): void => {
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