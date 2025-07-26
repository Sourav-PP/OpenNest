import { Service } from "../../../../domain/entities/Service";

export interface ICreateServiceUseCase {
    execute(input: Service): Promise<Service>
}