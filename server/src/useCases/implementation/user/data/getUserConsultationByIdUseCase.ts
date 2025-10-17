import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IUserConsultationDetailsDto } from '@/useCases/dtos/consultation';
import { IGetUserConsultationByIdUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationByIdUseCase';
import { toUserConsultationDetail } from '@/useCases/mappers/consultationMapper';

export class GetUserConsultationByIdUseCase implements IGetUserConsultationByIdUseCase {
    private _consultationRepo: IConsultationRepository;

    constructor(consultationRepo: IConsultationRepository) {
        this._consultationRepo = consultationRepo;
    }

    async execute(consultationId: string): Promise<IUserConsultationDetailsDto> {
        if (!consultationId) {
            throw new AppError(bookingMessages.ERROR.CONSULTATION_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const result = await this._consultationRepo.findByIdWithDetails(consultationId);
        if (!result) {
            throw new AppError(bookingMessages.ERROR.CONSULTATION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const mappedConsultation = toUserConsultationDetail(
            result.consultation,
            result?.psychologist,
            result?.user,
            result?.slot,
            result?.payment,
        );

        return mappedConsultation;
    }
}
