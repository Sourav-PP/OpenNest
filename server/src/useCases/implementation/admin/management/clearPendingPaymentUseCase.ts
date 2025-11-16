import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IClearPendingPaymentUseCase } from '@/useCases/interfaces/admin/management/IClearPendingPaymentUseCase';

export class ClearPendingPaymentUseCase implements IClearPendingPaymentUseCase {
    private _paymentRepo: IPaymentRepository;

    constructor(paymentRepo: IPaymentRepository) {
        this._paymentRepo = paymentRepo;
    }

    async execute(): Promise<void> {
        const expiryThreshold = new Date(Date.now() - 5 * 10 * 1000);
        const pendingPayments = await this._paymentRepo.findPendingPayments(expiryThreshold);

        for (const payment of pendingPayments) {
            await this._paymentRepo.deleteById(payment.id);
        }
    }
}
