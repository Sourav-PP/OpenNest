import { VideoCall } from '@/domain/entities/videoCall';

export interface IStartVideoCallUseCase {
    execute(consultationId: string): Promise<VideoCall>;
}
