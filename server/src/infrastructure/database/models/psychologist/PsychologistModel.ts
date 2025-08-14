import { Schema, Model, model, Document, Types } from 'mongoose';

export interface ISpecializationFee {
  specializationId: Types.ObjectId;
  specializationName: string;
  fee: number;
}

export interface IPsychologistDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  aboutMe: string;
  qualification: string;
  specializations: Types.ObjectId[];
  defaultFee: number;
  isVerified: boolean;
  specializationFees: ISpecializationFee[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SpecializationFeeSchema = new Schema<ISpecializationFee>(
    {
        specializationId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        specializationName: {
            type: String,
        },
        fee: {
            type: Number,
            required: true,
        },
    },
    { _id: false },
);

const PsychologistSchema = new Schema<IPsychologistDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        aboutMe: {
            type: String,
            required: true,
        },
        qualification: {
            type: String,
            required: true,
        },
        specializations: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Service',
            },
        ],
        defaultFee: {
            type: Number,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        specializationFees: [SpecializationFeeSchema],
    },
    { timestamps: true },
);

export const PsychologistModel: Model<IPsychologistDocument> = model<IPsychologistDocument>('Psychologist', PsychologistSchema);
