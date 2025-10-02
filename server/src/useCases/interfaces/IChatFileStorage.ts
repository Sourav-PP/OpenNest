export interface IChatFileStorage {
    upload(fileBuffer: Buffer, filename: string, folder: string): Promise<{url: string, type: string}>;
}