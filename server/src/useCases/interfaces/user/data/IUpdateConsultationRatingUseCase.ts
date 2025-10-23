export interface IUpdateConsultationRatingUseCase {
    execute(input: { userId: string; consultationId: string; rating: number; userFeedback: string }): Promise<void>;
}