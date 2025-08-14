import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const signupValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2 })
        .withMessage('Name must be atleast 2 characters long'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Mobile number is required')
        .matches(/^\d{10}$/)
        .withMessage('Mobile number must be exactly 10 digits'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        )
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        ),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
    body('role')
        .notEmpty()
        .withMessage('role is required')
        .isIn(['user', 'psychologist'])
        .withMessage('Role must be either "user" or "psychologist"'),
];

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};