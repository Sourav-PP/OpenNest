import { VideoCall } from '../entities/videoCall';

export interface IVideoCallRepository {
  create(call: Partial<VideoCall>): Promise<VideoCall>;
  update(callId: string, updates: Partial<VideoCall>): Promise<VideoCall | null>;
  findById(id: string): Promise<VideoCall | null>;
  findByConsultationId(consultationId: string): Promise<VideoCall | null>;
  delete(id: string): Promise<void>;
}