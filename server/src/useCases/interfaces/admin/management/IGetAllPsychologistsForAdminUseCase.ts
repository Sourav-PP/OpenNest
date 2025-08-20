import { IGetAllPsychologistRequest, IGetAllPsychologistResponse } from '@/useCases/types/adminTypes';

export interface IGetAllPsychologistsForAdminUseCase {
    execute(input: IGetAllPsychologistRequest): Promise<IGetAllPsychologistResponse>
}