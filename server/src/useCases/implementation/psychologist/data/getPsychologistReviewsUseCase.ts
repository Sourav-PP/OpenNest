import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { PaginatedPsychologistReviewsDTO } from '@/useCases/dtos/psychologist';
import { IGetPsychologistReviewsUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistReviewsUseCase';

export class GetPsychologistReviewsUseCase implements IGetPsychologistReviewsUseCase {
    private _consultationRepo: IConsultationRepository;

    constructor(consultationRepo: IConsultationRepository) {
        this._consultationRepo = consultationRepo;
    }

    async execute(psychologistId: string, page: number, limit: number): Promise<PaginatedPsychologistReviewsDTO> {
        if (!psychologistId) throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);

        return await this._consultationRepo.findPsychologistReviews(psychologistId, page, limit);
    }
}
