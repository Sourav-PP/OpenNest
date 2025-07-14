import { ServiceRepository } from "../../../domain/interfaces/serviceRepository";
import { IService } from "../../../domain/entities/service";

export class GetAllServiceUseCase {
    constructor(private serviceRepository: ServiceRepository) {}

    async execute(): Promise<IService[]> {
        return await this.serviceRepository.getAllServices()
    }
}