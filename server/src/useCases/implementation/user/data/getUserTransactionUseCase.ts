import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { ITransactionResponseDto } from '@/useCases/dtos/user';
import { IGetUserTransactionUseCase } from '@/useCases/interfaces/user/data/IGetUserTransactionUseCase';
import { toTransactionDto } from '@/useCases/mappers/userMapper';
import { IGetTransactionsRequest } from '@/useCases/types/userTypes';

export class GetUserTransactionUseCase implements IGetUserTransactionUseCase {
    private _paymentRepository: IPaymentRepository;

    constructor(paymentRepository: IPaymentRepository) {
        this._paymentRepository = paymentRepository;
    }

    async execute(input: IGetTransactionsRequest): Promise<ITransactionResponseDto> {
        const transactions = await this._paymentRepository.fndByUserId({
            userId: input.userId,
            page: input.page,
            limit: input.limit,
        });
        const mappedTransactions = transactions.map(t => toTransactionDto(t));
        const totalCount = await this._paymentRepository.countAll(input.userId);

        return {
            transactions: mappedTransactions,
            totalCount,
        };
    }
}
