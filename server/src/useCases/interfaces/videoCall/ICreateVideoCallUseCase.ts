export interface ICreateVideoCallUseCase {
    execute(consultationId: string, patientId: string, psychologistId: string): Promise<void>;
}