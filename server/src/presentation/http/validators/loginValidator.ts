import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';

export const loginValidator = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
        .isLength({ min: 6, max: 30 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[^a-zA-Z0-9]/)
        .withMessage('Password must contain at least one special character'),
];

export const loginValidate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Format errors as an array of { field, message }
        const formattedErrors = errors.array().map(err => ({
            field: (err as any).path,
            message: err.msg,
        }));
        throw new AppError('Validation failed', HttpStatus.UNPROCESSABLE_ENTITY, true, formattedErrors);
    }
    next();
};
