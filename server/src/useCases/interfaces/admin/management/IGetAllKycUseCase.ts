import { IGetAllKycRequest, IGetAllKycResponse } from "../../../types/adminTypes";

export interface IGetAllKycUseCase {
    execute(input: IGetAllKycRequest): Promise<IGetAllKycResponse>
}