import cloudinary from '../infrastructure/config/cloudinary';
import path from 'path';

export const uploadToCloudinary = async(
    fileBuffer: Buffer,
    filename: string,
    folder: string,
): Promise<string> => {
    const baseFilename = path.parse(filename).name;
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, public_id: baseFilename, resource_type: 'auto' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result!.public_id);
            },
        ).end(fileBuffer);
    });
};