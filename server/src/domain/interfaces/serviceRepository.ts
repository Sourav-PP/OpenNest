import { IService } from "../entities/service";

export interface ServiceRepository {
    create(service: IService): Promise<IService>
    findByName(name: string): Promise<IService | null>
    getAllServices(): Promise<IService[]>
}