import { Schema, Model, model, Types, Document } from 'mongoose';

export interface IKycDocument extends Document {
  _id: Types.ObjectId;
  psychologistId: Types.ObjectId;
  identificationDoc: string;
  educationalCertification: string;
  experienceCertificate: string;
  kycStatus: string;
  rejectionReason: string;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const KycSchema = new Schema<IKycDocument>(
    {
        psychologistId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        identificationDoc: {
            type: String,
            required: true,
        },
        educationalCertification: {
            type: String,
            required: true,
        },
        experienceCertificate: {
            type: String,
            required: true,
        },
        kycStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        rejectionReason: {
            type: String,
        },
        verifiedAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

export const KycModel: Model<IKycDocument> = model<IKycDocument>('Kyc', KycSchema);