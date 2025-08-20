import { IGetAllPsychologistResponse, IGetAllPsychologistRequest } from '@/useCases/types/userTypes';

export interface IGetAllPsychologistsForUserUseCase {
    execute(
        input: IGetAllPsychologistRequest,
    ): Promise<IGetAllPsychologistResponse>;
}