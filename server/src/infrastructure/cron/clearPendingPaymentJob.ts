import cron from 'node-cron';
import { IClearPendingPaymentUseCase } from '@/useCases/interfaces/admin/management/IClearPendingPaymentUseCase';
import logger from '@/utils/logger';

export class ClearPendingPaymentJob {
    private _clearPendingPaymentUseCase: IClearPendingPaymentUseCase;

    constructor(
        clearPendingPaymentUseCase: IClearPendingPaymentUseCase,
    ) {
        this._clearPendingPaymentUseCase = clearPendingPaymentUseCase;
    }

    start(): void {
        cron.schedule('*/5 * * * *', async() => {
            try {
                await this._clearPendingPaymentUseCase.execute();
            } catch (error) {
                logger.error('Error running clearPendingPaymentsJob', error);
            }
        });
    }
}