import { IGetAllPsychologistRequest, IGetAllPsychologistResponse } from "../../../types/adminTypes";

export interface IGetAllPsychologistUseCase {
    execute(input: IGetAllPsychologistRequest): Promise<IGetAllPsychologistResponse>
}