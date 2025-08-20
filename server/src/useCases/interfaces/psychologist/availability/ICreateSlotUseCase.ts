import { IRecurringSlotInput, ISingleSlotInput } from '@/useCases/types/psychologistTypes';

export interface ICreateSlotUseCase {
    executeSingle(input: ISingleSlotInput): Promise<void>
    executeRecurring(input: IRecurringSlotInput): Promise<void>   
}