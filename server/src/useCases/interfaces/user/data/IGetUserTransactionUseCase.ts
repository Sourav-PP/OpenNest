import { ITransactionResponseDto } from '@/useCases/dtos/user';
import { IGetTransactionsRequest } from '@/useCases/types/userTypes';

export interface IGetUserTransactionUseCase {
    execute(input: IGetTransactionsRequest): Promise<ITransactionResponseDto>;
}
