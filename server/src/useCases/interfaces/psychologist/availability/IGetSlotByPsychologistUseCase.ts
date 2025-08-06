import { Slot } from "../../../../domain/entities/slot";

export interface IGetSlotByPsychologistUseCase {
    execute(psychologistId: string): Promise<Slot[]>
}