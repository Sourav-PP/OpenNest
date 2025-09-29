import { VideoCall } from '@/domain/entities/videoCall';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { videoCallMessages } from '@/shared/constants/messages/videoCallMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IEndVideoCallUseCase } from '@/useCases/interfaces/videoCall/IEndVideoCallUseCase';

export class EndVideoCallUseCase implements IEndVideoCallUseCase {
    private _videoCallRepo: IVideoCallRepository;
    private _consultationRepo: IConsultationRepository;

    constructor(videoCallRepo: IVideoCallRepository, consultationRepo: IConsultationRepository) {
        this._videoCallRepo = videoCallRepo;
        this._consultationRepo = consultationRepo;
    }

    async execute(consultationId: string): Promise<VideoCall> {
        const call =
            await this._videoCallRepo.findByConsultationId(consultationId);
        if (!call)
            throw new AppError(
                videoCallMessages.ERROR.NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        if (call.status === 'completed') {
            return call;
        }

        if (call.status !== 'in-progress')
            throw new AppError(
                videoCallMessages.ERROR.NOT_ACTIVE,
                HttpStatus.BAD_REQUEST,
            );

        const endedAt = new Date();
        const duration = call.startedAt
            ? Math.floor((endedAt.getTime() - call.startedAt.getTime()) / 1000)
            : 0;

        const updated = await this._videoCallRepo.update(call.id, {
            status: 'completed',
            endedAt,
            duration,
        });

        if (!updated)
            throw new AppError(
                generalMessages.ERROR.INTERNAL_SERVER_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        
        await this._consultationRepo.updateConsultation(call.consultationId, {
            status: 'completed',
        });
        
        return updated;
    }
}
