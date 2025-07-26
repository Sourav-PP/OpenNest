import { IGetAllServiceInput, IGetAllServiceOutput } from "../../../types/serviceTypes";

export interface IGetAllServiceUseCase {
    execute(input: IGetAllServiceInput): Promise<IGetAllServiceOutput>
}