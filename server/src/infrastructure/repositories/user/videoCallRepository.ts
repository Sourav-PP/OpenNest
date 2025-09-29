import { VideoCall } from '@/domain/entities/videoCall';
import { IVideoCallRepository } from '@/domain/repositoryInterface/IVideoCallRepository';
import { VideoCallModel } from '@/infrastructure/database/models/user/VideoCallModel';

export class VideoCallRepository implements IVideoCallRepository {
    async create(call: Partial<VideoCall>): Promise<VideoCall> {
        const created = await VideoCallModel.create(call);
        return {
            id: created._id.toString(),
            consultationId: created.consultationId.toString(),
            patientId: created.patientId.toString(),
            psychologistId: created.psychologistId.toString(),
            callUrl: created.callUrl,
            status: created.status,
            startedAt: created.startedAt,
            endedAt: created.endedAt,
            duration: created.duration,
            recordingUrl: created.recordingUrl,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
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
        return {
            id: call._id.toString(),
            consultationId: call.consultationId.toString(),
            patientId: call.patientId.toString(),
            psychologistId: call.psychologistId.toString(),
            callUrl: call.callUrl,
            status: call.status,
            startedAt: call.startedAt,
            endedAt: call.endedAt,
            duration: call.duration,
            recordingUrl: call.recordingUrl,
            createdAt: call.createdAt,
            updatedAt: call.updatedAt,
        };
    }

    async findById(id: string): Promise<VideoCall | null> {
        const call = await VideoCallModel.findById(id);
        if (!call) return null;
        return {
            id: call._id.toString(),
            consultationId: call.consultationId.toString(),
            patientId: call.patientId.toString(),
            psychologistId: call.psychologistId.toString(),
            callUrl: call.callUrl,
            status: call.status,
            startedAt: call.startedAt,
            endedAt: call.endedAt,
            duration: call.duration,
            recordingUrl: call.recordingUrl,
            createdAt: call.createdAt,
            updatedAt: call.updatedAt,
        };
    }

    async delete(id: string): Promise<void> {
        await VideoCallModel.findByIdAndDelete(id);
    }
}
