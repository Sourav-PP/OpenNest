import { Slot } from '@/domain/entities/slot';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { IGetSlotByPsychologistUseCase } from '@/useCases/interfaces/psychologist/availability/IGetSlotByPsychologistUseCase';
import { AppError } from '@/domain/errors/AppError';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class GetSlotByPsychologistUseCase implements IGetSlotByPsychologistUseCase {
    private _slotRepo: ISlotRepository;

    constructor(slotRepo: ISlotRepository) {
        this._slotRepo = slotRepo;
    }

    async execute(psychologistId: string): Promise<Slot[]> {
        const slots = await this._slotRepo.getAllSlotsByPsychologistId(psychologistId);

        if (!slots || slots.length === 0) {
            throw new AppError(psychologistMessages.ERROR.SLOT_NOT_FOUND, HttpStatus.NOT_FOUND); 
        }

        return slots;
    }
}
