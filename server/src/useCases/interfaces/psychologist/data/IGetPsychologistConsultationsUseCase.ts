import { IGetConsultationsRequest, IGetConsultationsResponse } from '@/useCases/types/psychologistTypes';


export interface IGetPsychologistConsultationUseCase {
    execute(input: IGetConsultationsRequest): Promise<IGetConsultationsResponse>
}