import { Schema, Document, Types, Model, model } from "mongoose";

export interface ISlotDocument extends Document {
    _id: Types.ObjectId;
    psychologistId: Types.ObjectId;
    startDateTime: Date;
    endDateTime: Date;
    isBooked: boolean;
    bookedBy?: Types.ObjectId;
}

const slotSchema = new Schema<ISlotDocument>(
    {
        psychologistId: {
            type: Schema.Types.ObjectId,
            requried: true,
            ref: 'Psychologist'
        },
        startDateTime: {
            type: Date,
            required: true,
        },
        endDateTime: {
            type: Date,
            required: true
        },
        isBooked: {
            type: Boolean,
            default: false
        },
        bookedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null   
        },
    },
    { timestamps: true }
)

export const SlotModel: Model<ISlotDocument> = model<ISlotDocument>("Slot", slotSchema)