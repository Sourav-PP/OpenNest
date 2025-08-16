import { v2 as cloudinary } from 'cloudinary';
import { appConfig } from '../config/config';
import { IFileStorage } from '@/useCases/interfaces/IFileStorage';
import path from 'path';

cloudinary.config({
    cloud_name: appConfig.cloudinary.cloudName,
    api_key: appConfig.cloudinary.apiKey,
    api_secret: appConfig.cloudinary.apiSecret,
});


export class CloudinaryStorage implements IFileStorage {
    async upload(fileBuffer: Buffer, filename: string, folder: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const baseFilename = path.parse(filename).name;
            cloudinary.uploader.upload_stream(
                { folder, public_id: baseFilename, resource_type: 'auto' },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!.public_id);
                },
            ).end(fileBuffer);
        });
    }
}