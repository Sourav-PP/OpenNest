import { PayoutRequest } from '@/domain/entities/payoutRequest';
import { AppError } from '@/domain/errors/AppError';
import { IPayoutRequestRepository } from '@/domain/repositoryInterface/IPayoutRequestRepository';
import { payoutMessages } from '@/shared/constants/messages/payoutMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IRejectPayoutRequestUseCase } from '@/useCases/interfaces/payout/IRejectPayoutRequestUsecase';

export class RejectPayoutRequestUseCase implements IRejectPayoutRequestUseCase {
    private _payoutRequestRepository: IPayoutRequestRepository;

    constructor(payoutRequestRepository: IPayoutRequestRepository) {
        this._payoutRequestRepository = payoutRequestRepository;
    }

    async execute(id: string): Promise<PayoutRequest | null> {
        const payout = await this._payoutRequestRepository.findById(id);

        if (!payout)
            throw new AppError(
                payoutMessages.ERROR.NOT_FOUND,
                HttpStatus.NOT_FOUND,
            );
        if (payout.status !== 'pending')
            throw new AppError(
                payoutMessages.ERROR.REJECT_ONLY_PENDING,
                HttpStatus.BAD_REQUEST,
            );

        await this._payoutRequestRepository.updateStatus(
            id,
            'rejected',
            new Date(),
        );

        return this._payoutRequestRepository.findById(id);
    }
}
