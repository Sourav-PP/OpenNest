import { Wallet } from '@/domain/entities/wallet';
import { WalletTransaction } from '@/domain/entities/walletTransaction';
import { IWalletRepository } from '@/domain/repositoryInterface/IWalletRepository';
import { WalletModel } from '@/infrastructure/database/models/user/WalletModel';
import { WalletTransactionModel } from '@/infrastructure/database/models/user/WalletTransactionModel';

export class WalletRepository implements IWalletRepository {
    async create(userId: string, currency = 'USD'): Promise<Wallet> {
        const wallet = await WalletModel.create({
            userId,
            currency,
            balance: 0,
        });

        const walletObj = wallet.toObject();

        return {
            id: walletObj._id.toString(),
            userId: walletObj.userId.toString(),
            balance: walletObj.balance,
            currency: walletObj.currency,
        };
    }

    async findById(id: string): Promise<Wallet | null> {
        const wallet = await WalletModel.findById(id);

        if (!wallet) return null;
        const walletObj = wallet.toObject();

        return {
            id: walletObj._id.toString(),
            userId: walletObj.userId.toString(),
            balance: walletObj.balance,
            currency: walletObj.currency,
        };
    }

    async findByUserId(userId: string): Promise<Wallet | null> {
        const wallet = await WalletModel.findOne({ userId });
        if (!wallet) return null;
        const walletObj = wallet.toObject();

        return {
            id: walletObj._id.toString(),
            userId: walletObj.userId.toString(),
            balance: walletObj.balance,
            currency: walletObj.currency,
        };
    }

    async createTransaction(
        data: Omit<WalletTransaction, 'id' | 'status'>,
    ): Promise<WalletTransaction> {
        const transaction = await WalletTransactionModel.create(data);
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
    ): Promise<Wallet | null> {
        const wallet = await WalletModel.findByIdAndUpdate(
            walletId,
            { $inc: { balance: amount } },
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
            status: 'completed',
            reference,
            metadata: { reason: 'Consultation cancellation refund' },
        });
    }
}
