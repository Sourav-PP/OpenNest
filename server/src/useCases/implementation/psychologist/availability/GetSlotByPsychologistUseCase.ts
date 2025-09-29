import { Slot } from '@/domain/entities/slot';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { IGetSlotByPsychologistUseCase } from '@/useCases/interfaces/psychologist/availability/IGetSlotByPsychologistUseCase';
import { AppError } from '@/domain/errors/AppError';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';

export class GetSlotByPsychologistUseCase implements IGetSlotByPsychologistUseCase {
    private _slotRepo: ISlotRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(slotRepo: ISlotRepository, psychologistRepo: IPsychologistRepository) {
        this._slotRepo = slotRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(userId: string): Promise<Slot[]> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const slots = await this._slotRepo.getAllSlotsByPsychologistId(psychologist.id);

        if (!slots || slots.length === 0) {
            throw new AppError(psychologistMessages.ERROR.SLOT_NOT_FOUND, HttpStatus.NOT_FOUND); 
        }

        return slots;
    }
}
