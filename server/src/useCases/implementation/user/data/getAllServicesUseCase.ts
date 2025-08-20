import { IServiceRepository } from '@/domain/repositoryInterface/IServiceRepository';
import { IGetAllServiceInput, IGetAllServiceOutput } from '@/useCases/types/serviceTypes';
import { IGetAllServiceUseCase } from '@/useCases/interfaces/user/data/IGetAllServiceUseCase';

export class GetAllServiceUseCase implements IGetAllServiceUseCase {
    private _serviceRepository: IServiceRepository;

    constructor(serviceRepository: IServiceRepository) {
        this._serviceRepository = serviceRepository;
    }

    async execute(input?: IGetAllServiceInput): Promise<IGetAllServiceOutput> {
        const limit = input?.limit || 10;
        const page = input?.page || 1;
        const skip = (page - 1) * limit;

        const { services, totalCount } = await this._serviceRepository.getAllServices(limit, skip, input?.search);

        return {
            services,
            totalCount,
        };
    }
}