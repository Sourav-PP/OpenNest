import { UserGender, UserRole } from '@/domain/enums/UserEnums';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  profileImage?: string,
  dateOfBirth?: Date,
  gender?: UserGender,
  isActive: boolean,
  googleId?: string
}

const userSchema = new Schema<IUserDocument>(
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
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
        },
        profileImage: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: Object.values(UserGender),
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        password: {
            type: String,
            required: false,
            select: false,
        },
        googleId: {
            type: String,
            required: false,
        },
    },
    { timestamps: true },
);

export const userModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema);