import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IWalletTransactionDocument extends Document {
  _id: Types.ObjectId;
  walletId: Types.ObjectId;
  amount: number,
  type: 'credit' | 'debit' | 'transferIn' | 'transferOut',
  status: 'pending' | 'completed' | 'failed',
  reference?: string,
  metadata?: any,
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransactionDocument>(
    {
        walletId: {
            type: Schema.Types.ObjectId,
            ref: 'Wallet',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['credit', 'debit', 'transferIn', 'transferOut'],
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        reference: {
            type: String,
            unique: true,
            sparse: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    { timestamps: true },
);

export const WalletTransactionModel: Model<IWalletTransactionDocument> = model<IWalletTransactionDocument>('WalletTransaction', WalletTransactionSchema);