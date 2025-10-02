import { Service } from '@/domain/entities/service';
import { IServiceRepository } from '@/domain/repositoryInterface/IServiceRepository';
import { IServiceDocument, ServiceModel } from '@/infrastructure/database/models/admin/serviceModel';
import { GenericRepository } from '../GenericRepository';

export class ServiceRepository extends GenericRepository<Service, IServiceDocument> implements IServiceRepository {
    constructor() {
        super(ServiceModel);
    }

    protected map(doc: IServiceDocument): Service {
        const mapped = super.map(doc);
        
        return {
            id: mapped.id,
            name: mapped.name,
            description: mapped.description,
            bannerImage: mapped.bannerImage,
        };
    }

    async findByName(name: string): Promise<Service | null> {
        const result = await ServiceModel.findOne({
            name: { $regex: `^${name}`, $options: 'i' },
        });
        if (!result) return null;
        return this.map(result);
    }

    async getAllServices(
        limit: number,
        skip: number,
        search: string,
    ): Promise<{ services: Service[]; totalCount: number }> {
        const filter: Record<string, any> = {};

        if (search && search.trim() !== '') {
            filter.name = { $regex: search, $options: 'i' };
        }
        const totalCount = await ServiceModel.countDocuments(filter).exec();
        const services = await ServiceModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const mappedServices: Service[] = services.map(s => this.map(s));
        return {
            services: mappedServices,
            totalCount,
        };
    }

    async delete(id: string): Promise<void> {
        await super.deleteById(id);
    }
}
