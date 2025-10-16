import { Wallet } from '@/domain/entities/wallet';
import { WalletTransaction } from '@/domain/entities/walletTransaction';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { IWalletDocument, WalletModel } from '@/infrastructure/database/models/user/WalletModel';
import { WalletTransactionModel } from '@/infrastructure/database/models/user/WalletTransactionModel';
import { GenericRepository } from '../GenericRepository';
import { ClientSession } from 'mongoose';
import { WalletTransactionStatus } from '@/domain/enums/WalletEnums';

export class WalletRepository extends GenericRepository<Wallet, IWalletDocument> implements IWalletRepository {
    constructor() {
        super(WalletModel);
    }

    protected map(doc: IWalletDocument): Wallet {
        const mapped = super.map(doc);
        
        return {
            id: mapped.id,
            userId: mapped.userId as string,
            balance: mapped.balance,
            currency: mapped.currency,
        };
    }

    async createForUser(userId: string, currency = 'USD'): Promise<Wallet> {
        const wallet = await WalletModel.create({
            userId,
            currency,
            balance: 0,
        });

        return this.map(wallet);
    }

    async findByUserId(userId: string): Promise<Wallet | null> {
        const wallet = await WalletModel.findOne({ userId });
        if (!wallet) return null;
        return this.map(wallet);
    }

    async createTransaction(
        data: Omit<WalletTransaction, 'id'>, session?: ClientSession,
    ): Promise<WalletTransaction> {
        const transaction = await WalletTransactionModel.create([data], { session });
        const transactionObj = transaction[0].toObject();
        return {
            id: transactionObj._id.toString(),
            walletId: transactionObj.walletId.toString(),
            amount: transactionObj.amount,
            type: transactionObj.type,
            status: transactionObj.status,
            reference: transactionObj.reference,
            metadata: transactionObj.metadata,
        };
    }

    async findTransactionByReference(
        reference: string,
    ): Promise<WalletTransaction | null> {
        const transaction = await WalletTransactionModel.findOne({ reference });
        if (!transaction) return null;

        const transactionObj = transaction.toObject();
        return {
            id: transactionObj._id.toString(),
            walletId: transactionObj.walletId.toString(),
            amount: transactionObj.amount,
            type: transaction.type,
            status: transaction.status,
            reference: transaction.reference,
            metadata: transaction.metadata,
        };
    }

    async listTransaction(
        walletId: string,
        skip: number,
        limit: number,
    ): Promise<WalletTransaction[]> {
        const transactions = await WalletTransactionModel.find({ walletId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return transactions.map(t => ({
            id: t._id.toString(),
            walletId: t.walletId.toString(),
            amount: t.amount,
            type: t.type,
            status: t.status,
            reference: t.reference,
            metadata: t.metadata,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
        }));
    }

    async countAll(walletId: string): Promise<number> {
        return await WalletTransactionModel.countDocuments({ walletId });
    }

    async safeDebit(walletId: string, amount: number): Promise<Wallet | null> {
        const wallet = await WalletModel.findOneAndUpdate(
            { _id: walletId, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { new: true },
        );

        if (!wallet) return null;

        return {
            id: wallet._id.toString(),
            userId: wallet.userId.toString(),
            balance: wallet.balance,
            currency: wallet.currency,
        };
    }

    async updateBalance(
        walletId: string,
        amount: number,
        session?: ClientSession,
    ): Promise<Wallet | null> {
        const wallet = await WalletModel.findByIdAndUpdate(
            walletId,
            { $inc: { balance: amount } },
            { new: true, session },
        );

        if (!wallet) return null;

        return {
            id: wallet._id.toString(),
            userId: wallet.userId.toString(),
            balance: wallet.balance,
            currency: wallet.currency,
        };
    }

    async refundToWallet(
        walletId: string,
        amount: number,
        reference: string,
    ): Promise<void> {
        const wallet = await WalletModel.findById(walletId);
        if (!wallet) throw new Error('Wallet not found');

        wallet.balance += amount;
        await wallet.save();

        await WalletTransactionModel.create({
            walletId,
            amount,
            type: 'credit',
            status: WalletTransactionStatus.COMPLETED,
            reference,
            metadata: { reason: 'Consultation cancellation refund' },
        });
    }
}
