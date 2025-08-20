import { Slot } from '@/domain/entities/slot';

export interface IGetSlotByPsychologistUseCase {
    execute(userId: string): Promise<Slot[]>
}