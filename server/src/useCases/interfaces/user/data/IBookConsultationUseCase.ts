import { IConsultationBookingInput } from '@/useCases/types/consultationTypes';

export interface IBookConsultationUseCase {
    execute(input: IConsultationBookingInput): Promise<void>
}