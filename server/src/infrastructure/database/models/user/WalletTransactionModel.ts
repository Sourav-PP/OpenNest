import { WalletTransactionStatus, WalletTransactionType } from '@/domain/enums/WalletEnums';
import { Schema, model, Document, Model, Types } from 'mongoose';

export interface IWalletTransactionDocument extends Document {
  _id: Types.ObjectId;
  walletId: Types.ObjectId;
  amount: number,
  type: WalletTransactionType,
  status: WalletTransactionStatus,
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
            enum: Object.values(WalletTransactionType),
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(WalletTransactionStatus),
            default: WalletTransactionStatus.PENDING,
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