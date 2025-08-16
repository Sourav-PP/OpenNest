import { IDeleteSlotInput } from '@/useCases/types/psychologistTypes';

export interface IDeleteSlotUseCase {
    execute(input: IDeleteSlotInput): Promise<void> 
}