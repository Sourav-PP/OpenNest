import { IConsultationBookingInput } from '../../../types/consultaionTypes';

export interface IBookConsultationUseCase {
    execute(input: IConsultationBookingInput): Promise<void>
}