import multer from 'multer';

const memoryStorage = multer.memoryStorage();

export const uploadFields = (fields: string[]) => {
    return multer({ storage: memoryStorage }).fields(fields.map(name => ({ name, maxCount: 1 })));
};

export const uploadSingle = multer({ storage: memoryStorage }).single('file');
export const uploadMultiple = multer({ storage: memoryStorage }).array('files');
