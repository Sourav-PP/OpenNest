import multer from 'multer'

const memoryStorate = multer.memoryStorage()

export const uploadFields = (fields: string[]) => {
    return multer({ storage: memoryStorate }).fields(
        fields.map((name) => ({ name, maxCount: 1}))
    )
}

export const uploadSingle = multer({ storage: memoryStorate }).single('file')
export const uploadMultiple = multer({ storage: memoryStorate }).array('files')