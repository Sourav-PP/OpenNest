import { Service } from "../entities/Service";

export interface IServiceRepository {
    create(service: Service): Promise<Service>
    findByName(name: string): Promise<Service | null>
    getAllServices(limit?: number, offset?:number): Promise<{services: Service[]; totalCount: number}>
}   