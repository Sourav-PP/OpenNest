import { ISlotDto } from '@/useCases/dtos/slot';
import { IGetSlotForUserInput } from '@/useCases/types/userTypes';

export interface IGetSlotForUserUseCase {
    execute(input: IGetSlotForUserInput): Promise<ISlotDto[]>
}