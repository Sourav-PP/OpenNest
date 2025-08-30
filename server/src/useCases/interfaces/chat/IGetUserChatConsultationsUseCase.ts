import { IGetUserChatConsultationsResponse } from '@/useCases/types/chatTypes';
import { IGetConsultationsRequest } from '@/useCases/types/userTypes';

export interface IGetUserChatConsultationsUseCase {
    execute(input: IGetConsultationsRequest): Promise<IGetUserChatConsultationsResponse>;
}
