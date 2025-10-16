import { IServiceRepository } from '@/domain/repositoryInterface/IServiceRepository';
import { ICreateServiceUseCase } from '@/useCases/interfaces/admin/management/ICreateServiceUseCase';
import { Service } from '@/domain/entities/service';
import { AppError } from '@/domain/errors/AppError';
import { ICreateServiceDto } from '@/useCases/dtos/service';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IFileStorage } from '@/useCases/interfaces/IFileStorage';

export class CreateServiceUseCase implements ICreateServiceUseCase {
    private _serviceRepository: IServiceRepository;
    private _fileStorage: IFileStorage;

    constructor(
        serviceRepository: IServiceRepository,
        fileStorage: IFileStorage,
    ) {
        this._serviceRepository = serviceRepository;
        this._fileStorage = fileStorage;
    }

    async execute(data: ICreateServiceDto): Promise<Service> {
        const cloudUrl = await this._fileStorage.upload(
            data.file.buffer,
            data.file.originalname,
            'services',
        );

        const normalizedName = data.name.trim().toLowerCase();

        const existing =
            await this._serviceRepository.findByName(normalizedName);

        if (existing) {
            throw new AppError(
                adminMessages.ERROR.SERVICE_ALREADY_EXISTS,
                HttpStatus.CONFLICT,
            );
        }

        return this._serviceRepository.create({
            name: normalizedName,
            description: data.description,
            bannerImage: cloudUrl,
        });
    }
}
