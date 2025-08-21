export interface IFileStorage {
    upload(fileBuffer: Buffer, filename: string, folder: string): Promise<string>;
    uploadFromUrl(url: string, filename: string, folder: string): Promise<string>;
}