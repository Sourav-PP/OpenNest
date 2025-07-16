import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

export const loginValidate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array()})
        return
    }
    next()
}