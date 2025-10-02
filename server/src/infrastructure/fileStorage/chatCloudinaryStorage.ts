import { v2 as cloudinary } from 'cloudinary';
import { appConfig } from '../config/config';
import path from 'path';
import { IChatFileStorage } from '@/useCases/interfaces/IChatFileStorage';

cloudinary.config({
    cloud_name: appConfig.cloudinary.cloudName,
    api_key: appConfig.cloudinary.apiKey,
    api_secret: appConfig.cloudinary.apiSecret,
});

export class ChatCloudinaryStorage implements IChatFileStorage {
    async upload(
        fileBuffer: Buffer,
        filename: string,
        folder: string,
    ): Promise<{ url: string; type: string }> {
        return new Promise((resolve, reject) => {
            const baseFilename = path.parse(filename).name;
            cloudinary.uploader
                .upload_stream(
                    { folder, public_id: baseFilename, resource_type: 'auto' },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result?.secure_url)
                            return reject(
                                new Error(
                                    'Upload failed: no result returned from Cloudinary',
                                ),
                            );

                        const type = result.resource_type; // image, video, raw (for files)
                        resolve({ url: result.secure_url, type });
                    },
                )
                .end(fileBuffer);
        });
    }
}
