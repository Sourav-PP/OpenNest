import { UserRole } from '@/domain/enums/UserEnums';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IPendingSignupDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  profileImage?: string,
}

const pendingSignupSchema = new Schema<IPendingSignupDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false,
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
        },
        profileImage: {
            type: String,
        },
    },
    { timestamps: true },
);

export const PendingSignupModel: Model<IPendingSignupDocument> = model<IPendingSignupDocument>('PendingSignup', pendingSignupSchema);

