import { AppError } from '@/domain/errors/AppError';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IDeleteSlotUseCase } from '@/useCases/interfaces/psychologist/availability/IDeleteSlotUseCase';
import { IDeleteSlotInput } from '@/useCases/types/psychologistTypes';

export class DeleteSlotUseCase implements IDeleteSlotUseCase {
    private _slotRepo: ISlotRepository;

    constructor(slotRepo: ISlotRepository) {
        this._slotRepo = slotRepo;
    }

    async execute(input: IDeleteSlotInput): Promise<void> {
        const slot = await this._slotRepo.findById(input.slotId);

        if (!slot) {
            throw new AppError(psychologistMessages.ERROR.SLOT_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        if (slot.psychologistId.toString() !== input.psychologistId) {
            throw new AppError(authMessages.ERROR.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        await this._slotRepo.deleteById(input.slotId); 
    }
}