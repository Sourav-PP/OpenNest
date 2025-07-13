import { Schema, model, Document, Model, Types } from "mongoose";

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone: string;
  role: 'user' | 'psychologist';
  profileImage: string,
  dateOfBirth: Date,
  gender: string,
  isActive: boolean
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
        required: true,
    },
    role: {
      type: String,
      enum: ['user', 'psychologist'],
      required: true
    },
    profileImage: {
      type: String
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
  },
  { timestamps: true }
);

export const userModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema)