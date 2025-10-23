export interface IGetPsychologistTotalsUseCase {
    execute(userId: string): Promise<{ totalConsultations: number, totalPatients: number }>;
}