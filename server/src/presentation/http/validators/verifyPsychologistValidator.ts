import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
