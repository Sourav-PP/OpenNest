import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';

export const addPlanValidator = [
    body('name')
        .trim()
        .matches(/^[A-Za-z ]+$/)
        .withMessage('Name can only contain letters and spaces')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters')
        .matches(/^[A-Za-z ]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('price')
        .trim()
        .isFloat({ gt: 0, lt: 10001 })
        .withMessage('Price must be a positive number less than 10000')
        .toFloat(),

    // CREDITS
    body('creditsPerPeriod')
        .trim()
        .isInt({ gt: 0, lt: 101 })
        .withMessage('Credits must be a positive integer less than 100')
        .toInt(),

    //M BILLING PERIOD
    body('billingPeriod')
        .trim()
        .isIn(['month', 'year', 'week'])
        .withMessage('Billing period must be month, week, or year'),
];

export const validateAddPlan = (req: Request, res: Response, next: NextFunction): void => {
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
