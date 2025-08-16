export interface IFileStorage {
    upload(fileBuffer: Buffer, filename: string, folder: string): Promise<string>;
}