import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { videoCallMessages } from '@/shared/constants/messages/videoCallMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IConsultationHistoryDetailsDto } from '@/useCases/dtos/consultation';
import { IGetUserConsultationHistoryDetailsUseCase } from '@/useCases/interfaces/user/data/IGetUserConsultationHistoryDetailsUseCase';
import { toConsultationHistoryDetails } from '@/useCases/mappers/consultationMapper';

export class GetUserConsultationHistoryDetailsUseCase implements IGetUserConsultationHistoryDetailsUseCase {
    private _consultationRepo: IConsultationRepository;
    private _videoCallRepo: IVideoCallRepository;

    constructor(
        consultationRepo: IConsultationRepository,
        videoCallRepo: IVideoCallRepository,
    ) {
        this._consultationRepo = consultationRepo;
        this._videoCallRepo = videoCallRepo;
    }

    async execute(
        consultationId: string,
    ): Promise<IConsultationHistoryDetailsDto> {
        if (!consultationId) {
            throw new AppError(
                bookingMessages.ERROR.CONSULTATION_ID_REQUIRED,
                HttpStatus.BAD_REQUEST,
            );
        }

        const result =
            await this._consultationRepo.findByIdWithDetails(consultationId);
        if (!result) {
            throw new AppError(
                bookingMessages.ERROR.CONSULTATION_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        }

        const call = await this._videoCallRepo.findByConsultationId(consultationId);

        if (!call) {
            throw new AppError(videoCallMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const mappedConsultation = toConsultationHistoryDetails(
            result.consultation,
            result?.psychologist,
            result?.user,
            result?.slot,
            result?.payment,
            call,
        );

        return mappedConsultation;
    }
}
