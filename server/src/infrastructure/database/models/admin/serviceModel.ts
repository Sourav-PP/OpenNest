import { Schema, Model, model, Types, Document } from 'mongoose';

export interface IServiceDocument extends Document {
    _id: Types.ObjectId,
    name: string,
    description: string,
    bannerImage: string
}

const serviceSchema = new Schema<IServiceDocument>(
    {
        name: {
            type: String,
            requierd: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        bannerImage: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const ServiceModel: Model<IServiceDocument> = model<IServiceDocument>('Service', serviceSchema);