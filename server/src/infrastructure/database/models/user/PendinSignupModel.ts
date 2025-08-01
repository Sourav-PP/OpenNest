import { Schema, model, Document, Model, Types } from "mongoose";

export interface IPendingSignupDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'user' | 'psychologist';
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
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'psychologist'],
      required: true
    },
    profileImage: {
      type: String
    },
  },
  { timestamps: true }
);

export const PendingSignupModel: Model<IPendingSignupDocument> = model<IPendingSignupDocument>('PendingSignup', pendingSignupSchema)

