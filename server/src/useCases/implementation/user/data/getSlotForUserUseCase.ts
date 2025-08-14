import { ISlotDto } from '../../../../domain/dtos/slot';
import { AppError } from '../../../../domain/errors/AppError';
import { IPsychologistRepository } from '../../../../domain/interfaces/IPsychologistRepository';
import { ISlotRepository } from '../../../../domain/interfaces/ISlotRepository';
import { IGetSlotForUserUseCase } from '../../../interfaces/user/data/IGetSlotForUserUseCase';
import { IGetSlotForUsertInput } from '../../../types/userTypes';

export class GetSlotForUserUseCase implements IGetSlotForUserUseCase {
    constructor(
        private slotRepo: ISlotRepository,
        private psychologistRepo: IPsychologistRepository,
    ) {}

    async execute(input: IGetSlotForUsertInput): Promise<ISlotDto[]> {
        const date = input.date ?? new Date();

        const psychologist = await this.psychologistRepo.findByUserId(input.userId);

        if (!psychologist || !psychologist.id) {
            throw new AppError('Psychologist not found', 409);
        } 
        const slots = await this.slotRepo.getSlotByPsychologist(psychologist.id, date);
        return slots;
    }
}