import { VideoCallStatus } from '@/domain/enums/VideoCallEnums';
import { AppError } from '@/domain/errors/AppError';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { appConfig } from '@/infrastructure/config/config';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ICreateVideoCallUseCase } from '@/useCases/interfaces/videoCall/ICreateVideoCallUseCase';

export class CreateVideoCallUseCase implements ICreateVideoCallUseCase {
    private _videoCallRepository: IVideoCallRepository;

    constructor(videoCallRepository: IVideoCallRepository) {
        this._videoCallRepository = videoCallRepository;
    }
    async execute(consultationId: string, patientId: string, psychologistId: string): Promise<void> {
        if (!consultationId || !patientId || !psychologistId) {
            throw new AppError(generalMessages.ERROR.INVALID_INPUT, HttpStatus.BAD_REQUEST);
        }

        const existingCall = await this._videoCallRepository.findByConsultationId(consultationId);
        if (existingCall) {
            throw new AppError(generalMessages.ERROR.BAD_REQUEST, HttpStatus.BAD_REQUEST);
        }

        const callUrl = appConfig.server.frontendUrl + `/video-call/${consultationId}`;

        await this._videoCallRepository.create({
            consultationId,
            patientId,
            psychologistId,
            callUrl,
            status: VideoCallStatus.SCHEDULED,
            startedAt: null,
            endedAt: null,
        });
    }
}
