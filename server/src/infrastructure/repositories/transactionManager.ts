import { ITransactionManager } from '@/domain/repositoryInterface/ITransactionManager';
import mongoose, { ClientSession } from 'mongoose';

export class TransactionManager implements ITransactionManager<ClientSession> {
    async runInTransaction<T>(
        callback: (session: ClientSession) => Promise<T>,
    ): Promise<T> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const result = await callback(session);
            await session.commitTransaction();
            session.endSession();
            return result;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}
