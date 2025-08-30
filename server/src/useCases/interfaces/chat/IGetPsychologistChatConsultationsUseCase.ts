import { IGetPsychologistChatConsultationsResponse } from '@/useCases/types/chatTypes';
import { IGetConsultationsRequest } from '@/useCases/types/psychologistTypes';

export interface IGetPsychologistChatConsultationsUseCase {
    execute(input: IGetConsultationsRequest): Promise<IGetPsychologistChatConsultationsResponse>;
}
