import { IService } from "../../../domain/entities/service";
import { ServiceRepository } from "../../../domain/interfaces/serviceRepository";
import { ServiceModel } from "../../database/models/admin/serviceModel";

export class MongoServiceRepository implements ServiceRepository {
    async create(service: IService): Promise<IService> {
        const newService = new ServiceModel(service)
        await newService.save()
        return {
            ...newService.toObject(),
            _id: newService._id.toString()
        }
    }

    async findByName(name: string): Promise<IService | null> {
        const result = await ServiceModel.findOne({ name: { $regex: `^${name}`, $options: 'i'}})
        if(!result) return null
        const obj = result.toObject()

        return {
            _id: obj._id.toString(),
            name: obj.name,
            description: obj.description,
            bannerImage: obj.bannerImage
        }
    }
}