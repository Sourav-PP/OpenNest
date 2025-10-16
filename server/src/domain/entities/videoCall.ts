import { VideoCallStatus } from '../enums/VideoCallEnums';

export interface VideoCall {
    id: string;
    consultationId: string;
    patientId: string;
    psychologistId: string;
    callUrl: string;
    status: VideoCallStatus;
    startedAt: Date | null;
    endedAt: Date | null;
    duration?: number;
    recordingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
