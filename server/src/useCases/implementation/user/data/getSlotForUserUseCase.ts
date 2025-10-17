import { ISlotDto } from '@/useCases/dtos/slot';
import { AppError } from '@/domain/errors/AppError';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { ISlotRepository } from '@/domain/repositoryInterface/ISlotRepository';
import { IGetSlotForUserUseCase } from '@/useCases/interfaces/user/data/IGetSlotForUserUseCase';
import { IGetSlotForUserInput } from '@/useCases/types/userTypes';
import { toSlotDto } from '@/useCases/mappers/slotMapper';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import logger from '@/utils/logger';

export class GetSlotForUserUseCase implements IGetSlotForUserUseCase {
    private _slotRepo: ISlotRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(slotRepo: ISlotRepository, psychologistRepo: IPsychologistRepository) {
        this._slotRepo = slotRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(input: IGetSlotForUserInput): Promise<ISlotDto[]> {
        const date = input.date ?? new Date();
        logger.info(date);

        const psychologist = await this._psychologistRepo.findByUserId(input.userId);

        if (!psychologist || !psychologist.id) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const entities = await this._slotRepo.getSlotByPsychologist(psychologist.id, date);

        return entities.map(entity => toSlotDto(entity.slot, entity.user));
    }
}
