import { ServiceRepository } from "../../../domain/interfaces/serviceRepository";
import { IService } from "../../../domain/entities/service";
import { AppError } from "../../../domain/errors/AppError";

export class CreateServiceUseCase {
    constructor(
        private serviceRepository: ServiceRepository
    ) {}

    async execute(data: IService): Promise<IService> {
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