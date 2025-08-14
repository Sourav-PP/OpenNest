import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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
        res.status(400).json({ message: errors.array() });
        return; 
    }
    next();
};