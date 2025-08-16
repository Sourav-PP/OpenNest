import { ICreateCheckoutSessionInput, ICreateCheckoutSessionOutput } from '@/useCases/types/payment';

export interface ICreateCheckoutSessionUseCase {
    execute(input: ICreateCheckoutSessionInput): Promise<ICreateCheckoutSessionOutput>
}