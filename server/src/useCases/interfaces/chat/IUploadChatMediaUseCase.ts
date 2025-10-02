export interface IUploadChatMediaUseCase {
    execute(file: Express.Multer.File): Promise<{mediaUrl: string, mediaType: string}>;
}