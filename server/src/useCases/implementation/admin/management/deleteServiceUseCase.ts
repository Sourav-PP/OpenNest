import { AppError } from '@/domain/errors/AppError';
import { IServiceRepository } from '@/domain/repositoryInterface/IServiceRepository';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IDeleteServiceUseCase } from '@/useCases/interfaces/admin/management/IDeleteServiceUseCase';

export class DeleteServiceUseCase implements IDeleteServiceUseCase {
    private _serviceRepository: IServiceRepository;

    constructor(serviceRepo: IServiceRepository) {
        this._serviceRepository = serviceRepo;
    }

    async execute(id: string): Promise<void> {
        const service = await this._serviceRepository.findById(id);

        if (!service)
            throw new AppError(
                adminMessages.ERROR.SERVICE_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );

        await this._serviceRepository.delete(id);
    }
}
