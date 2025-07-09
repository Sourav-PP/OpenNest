import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    filename: string,
    folder: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder, public_id: filename, resource_type: "auto"},
            (error, result) => {
                if(error) return reject(error)
                resolve(result!.secure_url)
            }
        ).end(fileBuffer)
    })
}