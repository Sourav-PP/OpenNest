import { IGetConsultationsRequest, IGetConsultationsResponse } from '@/useCases/types/userTypes';

export interface IGetUserConsultationUseCase {
    execute(input: IGetConsultationsRequest): Promise<IGetConsultationsResponse>
}