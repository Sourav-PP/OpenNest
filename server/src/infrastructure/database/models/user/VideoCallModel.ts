import { VideoCallStatus } from '@/domain/enums/VideoCallEnums';
import { Schema, model, Document, Model, Types } from 'mongoose';


export interface IVideoCallDocument extends Document {
    _id: Types.ObjectId;
    consultationId: Types.ObjectId;
    patientId: Types.ObjectId;
    psychologistId: Types.ObjectId;
    callUrl: string;
    status: VideoCallStatus;
    startedAt: Date | null;
    endedAt: Date | null;
    duration?: number; 
    recordingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const videoCallSchema = new Schema<IVideoCallDocument>(
    {
        consultationId: {
            type: Schema.Types.ObjectId,
            ref: 'Consultation',
            required: true,
            unique: true,
        },
        patientId: {
            type: Schema.Types.ObjectId,  
            ref: 'User',
            required: true,
        },  
        psychologistId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        callUrl: {  
            type: String,
            required: true,
        },  
        status: {
            type: String,
            enum: Object.values(VideoCallStatus),  
            default: VideoCallStatus.SCHEDULED,
        },  
        startedAt: {  
            type: Date,
            default: null,
        },
        endedAt: {  
            type: Date,
            default: null,
        },
        duration: {  
            type: Number, 
            default: null,
        },
        recordingUrl: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);  

export const VideoCallModel: Model<IVideoCallDocument> = model<IVideoCallDocument>('VideoCall', videoCallSchema);