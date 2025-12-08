import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Allowed MIME types
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

// Detect file signature ("magic numbers")
const checkMagicNumber = (buffer: Buffer): boolean => {
    const signatures = {
        jpg: [0xff, 0xd8, 0xff],
        png: [0x89, 0x50, 0x4e, 0x47],
        webp: [0x52, 0x49, 0x46, 0x46], // RIFF
    };

    const bytes = Array.from(buffer.slice(0, 4));

    if (bytes.slice(0, 3).join(',') === signatures.jpg.join(',')) return true;
    if (bytes.join(',') === signatures.png.join(',')) return true;
    if (bytes.join(',') === signatures.webp.join(',')) return true;

    return false;
};

export const updateUserProfileValidator = [
    // NAME
    body('name')
        .trim()
        .matches(/^[A-Za-z ]+$/)
        .withMessage('Name can only contain letters and spaces')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    // EMAIL
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .isLength({ max: 100 })
        .withMessage('Email is too long'),

    // PHONE (E.164 + libphonenumber-js + no repeating)
    body('phone')
        .trim()
        .matches(/^\+[1-9]\d{7,14}$/)
        .withMessage('Enter a valid international phone number')
        .custom(value => {
            const phone = parsePhoneNumberFromString(value);
            if (!phone || !phone.isValid()) {
                throw new Error('Phone number is not valid');
            }
            return true;
        })
        .custom(value => {
            const digits = value.replace(/\D/g, '');
            if (/^(\d)\1+$/.test(digits)) {
                throw new Error('Phone number cannot be all repeated digits');
            }
            return true;
        }),

    // DATE OF BIRTH (optional)
    body('dateOfBirth')
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage('Date of birth must be in YYYY-MM-DD format')
        .custom(value => {
            const dob = new Date(value);
            const today = new Date();

            const age =
                today.getFullYear() -
                dob.getFullYear() -
                (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);

            if (age < 18 || age > 99) {
                throw new Error('You must be at least 18 years old and less than 100 years old');
            }
            return true;
        }),

    // GENDER (optional)
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender value'),

    // PROFILE IMAGE (optional)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    body('profileImage').custom((_, { req }) => {
        const file = req.file;

        // If no file, it's optional → accept
        if (!file) return true;

        // SIZE check
        if (file.size > MAX_IMAGE_SIZE) {
            throw new Error('Image size should be less than 5MB');
        }

        // MIME check
        if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
            throw new Error('Invalid image MIME type');
        }

        // MAGIC NUMBER CHECK — prevents fake files
        if (!checkMagicNumber(file.buffer)) {
            throw new Error('Invalid or corrupted image file');
        }

        return true;
    }),
];

export const validateUpdateUserProfile = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formatted = errors.array().map(err => ({
            field: (err as any).path,
            message: err.msg,
        }));

        throw new AppError('Validation failed', HttpStatus.UNPROCESSABLE_ENTITY, true, formatted);
    }

    next();
};
