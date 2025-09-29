import { VideoCall } from '@/domain/entities/videoCall';

export interface IEndVideoCallUseCase {
    execute(consultationId: string): Promise<VideoCall>;
}
