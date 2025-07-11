import { Schema, Model, model, Types, Document } from "mongoose";

export interface IAdminDocument extends Document {
    _id: Types.ObjectId,
    email: string,
    password: string,
}   

const adminSchema = new Schema<IAdminDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            select: false
        }
    },
    { timestamps: true }
)

export const AdminModel: Model<IAdminDocument> = model<IAdminDocument>("Admin", adminSchema)