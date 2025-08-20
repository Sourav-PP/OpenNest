import { Service } from '@/domain/entities/service';
import { ICreateServiceDto } from '@/useCases/dtos/service';

export interface ICreateServiceUseCase {
    execute(input: ICreateServiceDto): Promise<Service>
}