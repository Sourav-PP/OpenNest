import { ICreateCheckoutSessionInput, ICreateCheckoutSessionOutput } from "../../../types/payment";

export interface ICreateCheckoutSessionUseCase {
    execute(input: ICreateCheckoutSessionInput): Promise<ICreateCheckoutSessionOutput>
}