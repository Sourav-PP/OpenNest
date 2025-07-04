import mongoose, {Document, mongo, Schema } from 'mongoose'

export interface OtpDocument extends Document {
    email: string
    otp: string
    verified: boolean;  
    createdAt: Date
}

const otpSchema = new Schema<OtpDocument>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
})

export const OtpModel = mongoose.model<OtpDocument>('otp', otpSchema)