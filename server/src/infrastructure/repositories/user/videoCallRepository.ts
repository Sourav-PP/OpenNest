import { VideoCall } from '@/domain/entities/videoCall';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { IVideoCallDocument, VideoCallModel } from '@/infrastructure/database/models/user/VideoCallModel';
import { GenericRepository } from '../GenericRepository';

export class VideoCallRepository extends GenericRepository<VideoCall, IVideoCallDocument> implements IVideoCallRepository {
    constructor() {
        super(VideoCallModel);
    }

    protected map(doc: IVideoCallDocument): VideoCall {
        const mapped = super.map(doc);
        
        return {
            id: mapped.id,
            consultationId: mapped.consultationId as string,
            patientId: mapped.patientId as string,
            psychologistId: mapped.psychologistId as string,
            callUrl: mapped.callUrl,
            status: mapped.status,
            startedAt: mapped.startedAt,
            endedAt: mapped.endedAt,
            duration: mapped.duration,
            recordingUrl: mapped.recordingUrl,
            createdAt: mapped.createdAt,
            updatedAt: mapped.updatedAt,
        };
    }

    async update(callId: string, updates: Partial<VideoCall>): Promise<VideoCall | null> {
        const updated = await VideoCallModel.findByIdAndUpdate(
            callId,
            { $set: updates },
            { new: true },
        );  
        if (!updated) return null;

        return {   
            id: updated._id.toString(),   
            consultationId: updated.consultationId.toString(),
            patientId: updated.patientId.toString(),
            psychologistId: updated.psychologistId.toString(),
            callUrl: updated.callUrl,
            status: updated.status,
            startedAt: updated.startedAt,
            endedAt: updated.endedAt,
            duration: updated.duration,
            recordingUrl: updated.recordingUrl,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        };
    }
    
    async findByConsultationId(consultationId: string): Promise<VideoCall | null> {
        const call = await VideoCallModel.findOne({ consultationId });
        if (!call) return null;
        return this.map(call);
    }

    async delete(id: string): Promise<void> {
        await VideoCallModel.findByIdAndDelete(id);
    }
}
