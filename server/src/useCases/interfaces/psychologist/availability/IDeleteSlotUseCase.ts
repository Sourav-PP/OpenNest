import { IDeleteSlotInput } from "../../../types/psychologistTypes";

export interface IDeleteSlotUseCase {
    execute(input: IDeleteSlotInput): Promise<void> 
}