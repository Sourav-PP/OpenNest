import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Magic number detection
const checkMagicNumber = (buffer: Buffer) => {
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

export const createServiceValidator = [
    body('name')
        .trim()
        .matches(/^[A-Za-z ]+$/)
        .withMessage('Name can only contain letters and spaces')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),

    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Description must be between 10 and 1000 characters'),

    // eslint-disable-next-line @typescript-eslint/naming-convention
    body('bannerImage').custom((_, { req }) => {
        const file = req.file;

        if (!file) throw new Error('Banner image is required');

        // Size check
        if (file.size > MAX_IMAGE_SIZE) {
            throw new Error('Image size should be less than 5MB');
        }

        // MIME validation
        if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
            throw new Error('Only JPEG, PNG, or WEBP images are allowed');
        }

        // Magic number check to detect fake images
        if (!checkMagicNumber(file.buffer)) {
            throw new Error('Invalid or corrupted image file');
        }

        return true;
    }),
];

export const validateCreateService = (req: Request, res: Response, next: NextFunction): void => {
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
