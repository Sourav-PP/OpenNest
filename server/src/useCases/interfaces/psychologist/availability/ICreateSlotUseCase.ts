import { Slot } from "../../../../domain/entities/slot";
import { IRecurringSlotInput } from "../../../types/psychologistTypes";

export interface ICreateSlotUseCase {
    executeSingle(input: Slot): Promise<void>
    executeRecurring(input: IRecurringSlotInput): Promise<void>   
}