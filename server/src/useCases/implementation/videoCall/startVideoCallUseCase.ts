import { IStartVideoCallUseCase } from '@/useCases/interfaces/videoCall/IStartVideoCallUseCase';
import { VideoCall } from '@/domain/entities/videoCall';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { AppError } from '@/domain/errors/AppError';
import { videoCallMessages } from '@/shared/constants/messages/videoCallMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { VideoCallStatus } from '@/domain/enums/VideoCallEnums';

export class StartVideoCallUseCase implements IStartVideoCallUseCase {
    private _videoCallRepo: IVideoCallRepository;

    constructor(videoCallRepo: IVideoCallRepository) {
        this._videoCallRepo = videoCallRepo;
    }

    async execute(consultationId: string): Promise<VideoCall> {
        const call = await this._videoCallRepo.findByConsultationId(consultationId);
        if (!call) throw new AppError(videoCallMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        if (call.status !== VideoCallStatus.SCHEDULED)
            throw new AppError(videoCallMessages.ERROR.NOT_SCHEDULED, HttpStatus.BAD_REQUEST);

        const updated = await this._videoCallRepo.update(call.id, {
            status: VideoCallStatus.IN_PROGRESS,
            startedAt: new Date(),
        });

        if (!updated) throw new AppError(generalMessages.ERROR.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        return updated;
    }
}
