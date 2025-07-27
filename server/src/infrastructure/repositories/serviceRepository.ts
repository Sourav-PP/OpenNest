import { Service } from "../../domain/entities/service";
import { IServiceRepository } from "../../domain/interfaces/IServiceRepository";
import { ServiceModel } from "../database/models/admin/serviceModel";

export class ServiceRepository implements IServiceRepository {
    async create(service: Service): Promise<Service> {
        const newService = new ServiceModel(service)
        await newService.save()
        return {
            ...newService.toObject(),
            id: newService._id.toString()
        }
    }

    async findByName(name: string): Promise<Service | null> {
        const result = await ServiceModel.findOne({ name: { $regex: `^${name}`, $options: 'i'}})
        if(!result) return null
        const obj = result.toObject()

        return {
            id: obj._id.toString(),
            name: obj.name,
            description: obj.description,
            bannerImage: obj.bannerImage
        }
    }

    async getAllServices(limit: number, offset: number): Promise<{ services: Service[]; totalCount: number; }> {
        const totalCount = await ServiceModel.countDocuments().exec()

        const services = await ServiceModel.find().skip(offset).limit(limit).lean().exec()
        const mappedServices: Service[] = services.map((s) => {
            return {
                id: s._id.toString(),
                name: s.name,
                bannerImage: s.bannerImage,
                description: s.description
            }
        })
        return {
            services: mappedServices,
            totalCount
        }
    }

}