import { IServiceRepository } from '../../../../domain/interfaces/IServiceRepository';
import { IGetAllServiceInput, IGetAllServiceOutput, ServiceDTO } from '../../../types/serviceTypes';
import { IGetAllServiceUseCase } from '../../../interfaces/user/data/IGetAllServiceUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class GetAllServiceUseCase implements IGetAllServiceUseCase {
    constructor(private serviceRepository: IServiceRepository) {}

    async execute(input?: IGetAllServiceInput): Promise<IGetAllServiceOutput> {
        try {
            const limit = input?.limit || 10;
            const page = input?.page || 1;
            const offset = (page - 1) * limit;

            const { services, totalCount } = await this.serviceRepository.getAllServices(limit, offset);
            const serviceDTOs: ServiceDTO[] = services.map((service) => ({
                id: service.id!,
                name: service.name,
                description: service.description,
                bannerImage: service.bannerImage,
            }));

            return {
                services: serviceDTOs,
                totalCount,
            };
        } catch (error) {
            throw new AppError('failed to fetch services', 500);
        }
    }
}