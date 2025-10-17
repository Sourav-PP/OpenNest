import { AppError } from '@/domain/errors/AppError';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IDeleteSlotUseCase } from '@/useCases/interfaces/psychologist/availability/IDeleteSlotUseCase';
import { IDeleteSlotInput } from '@/useCases/types/psychologistTypes';

export class DeleteSlotUseCase implements IDeleteSlotUseCase {
    private _slotRepo: ISlotRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(slotRepo: ISlotRepository, psychologistRepo: IPsychologistRepository) {
        this._slotRepo = slotRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(input: IDeleteSlotInput): Promise<void> {
        const psychologist = await this._psychologistRepo.findByUserId(input.userId);

        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const slot = await this._slotRepo.findById(input.slotId);

        if (!slot) {
            throw new AppError(psychologistMessages.ERROR.SLOT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (slot.psychologistId.toString() !== psychologist.id) {
            throw new AppError(authMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        await this._slotRepo.deleteById(input.slotId);
    }
}
