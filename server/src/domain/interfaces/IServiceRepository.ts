import { Service } from "../entities/service";

export interface IServiceRepository {
    create(service: Service): Promise<Service>
    findByName(name: string): Promise<Service | null>
    getAllServices(limit?: number, offset?:number): Promise<{services: Service[]; totalCount: number}>
}   