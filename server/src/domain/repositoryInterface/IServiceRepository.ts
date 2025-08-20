import { Service } from '../entities/service';

export interface IServiceRepository {
    create(service: Omit<Service, 'id'>): Promise<Service>
    findByName(name: string): Promise<Service | null>
    findById(id: string): Promise<Service | null>
    getAllServices(limit?: number, skip?:number, search?: string): Promise<{services: Service[]; totalCount: number}>
    delete(id: string): Promise<void>
}   