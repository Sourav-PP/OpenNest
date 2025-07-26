import { IServiceRepository } from "../../../../domain/interfaces/IServiceRepository";
import { ICreateServiceUseCase } from "../../../interfaces/admin/management/ICreateServiceUseCase";
import { Service } from "../../../../domain/entities/Service";
import { AppError } from "../../../../domain/errors/AppError";

export class CreateServiceUseCase implements ICreateServiceUseCase {
    constructor(
        private serviceRepository: IServiceRepository
    ) {}

    async execute(data: Service): Promise<Service> {
        const normalizedName = data.name.trim().toLowerCase()

        const existing = await this.serviceRepository.findByName(normalizedName)
        if(existing) {
            throw new AppError("Service name already exists", 409)
        }
        
        return this.serviceRepository.create({
            name: normalizedName,
            description: data.description,
            bannerImage: data.bannerImage
        })
    }
}