import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IWalletDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  balance: number,
  currency: string,
}

const WalletSchema = new Schema<IWalletDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        balance: {
            type: Number,
            required: true,
            default: 0,
        },
        currency: {
            type: String,
            required: true,
            uppercase: true,
        },
    },
    { timestamps: true },
);

export const WalletModel: Model<IWalletDocument> = model<IWalletDocument>('Wallet', WalletSchema);