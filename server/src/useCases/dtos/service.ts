export interface ICreateServiceDto {
    name: string;
    description: string;
    file: Express.Multer.File;
}