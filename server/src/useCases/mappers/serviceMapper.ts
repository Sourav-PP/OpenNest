import { Service } from '@/domain/entities/service';
import { IServiceDTO } from '../types/serviceTypes';

export function toServiceDTO(service: Service): IServiceDTO {
    return {
        id: service.id,
        name: service.name,
        description: service.description,
        bannerImage: service.bannerImage,
    };
}