import { Request, Response, NextFunction } from 'express';

export const validateFiles = (req: Request, res: Response, next: NextFunction): void => {
    console.log('enterred validate files');
    console.log('file is:',req.file);
    const files = req.files as {
    identificationDoc?: Express.Multer.File[],
    educationalCertification?: Express.Multer.File[],
    experienceCertificate?: Express.Multer.File[]
  };

    console.log('files: ', files);

    if (
        !files?.identificationDoc?.[0] ||
    !files?.educationalCertification?.[0] ||
    !files?.experienceCertificate?.[0]
    ) {
        res.status(400).json({
            message: 'All three documents are required: ID, educational, and experience certificates.',
        });
        return; 
    }
    console.log('now here');

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    for (const field of ['identificationDoc', 'educationalCertification', 'experienceCertificate']) {

        const fileArray = files[field as keyof typeof files]; // fileArray: Express.Multer.File[] | undefined

        if (!fileArray || fileArray.length === 0) {
            res.status(400).json({ message: `${field} is missing` });
            return; 
        }
        const file = fileArray[0];
        if (!allowedTypes.includes(file.mimetype)) {
            res.status(400).json({ message: `Invalid file type for ${field}` });
            return; 
        }

        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            res.status(400).json({ message: `${field} exceeds the 5MB size limit` });
            return; 
        }
        console.log('finally');
    }

    next();
};
