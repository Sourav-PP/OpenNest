import { ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IUpdateConsultationRatingUseCase } from '@/useCases/interfaces/user/data/IUpdateConsultationRatingUseCase';

export class UpdateConsultationRatingUseCase implements IUpdateConsultationRatingUseCase {
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(consultationRepo: IConsultationRepository, psychologistRepo: IPsychologistRepository) {
        this._consultationRepo = consultationRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(input: {
        userId: string;
        consultationId: string;
        rating: number;
        userFeedback: string;
    }): Promise<void> {
        const { userId, consultationId, rating, userFeedback } = input;

        const consultation = await this._consultationRepo.findById(consultationId);
        if (!consultation) throw new AppError(bookingMessages.ERROR.CONSULTATION_NOT_FOUND, HttpStatus.NOT_FOUND);

        if (consultation.status !== ConsultationStatus.COMPLETED) {
            throw new AppError(bookingMessages.ERROR.NOT_COMPLETED, HttpStatus.BAD_REQUEST);
        }

        if (consultation.patientId !== userId) {
            throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }

        const psychologist = await this._psychologistRepo.findById(consultation.psychologistId);

        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        await this._consultationRepo.updateConsultation(consultationId, {
            rating,
            userFeedback,
        });

        const consultations = await this._consultationRepo.findMany({
            psychologistId: psychologist.id,
        });

        const ratedConsultations = consultations.filter(c => c.rating !== undefined && c.rating !== null);

        const totalRatings = ratedConsultations.length;
        const avgRating =
            totalRatings > 0 ? ratedConsultations.reduce((sum, c) => sum + (c.rating || 0), 0) / totalRatings : 0;

        await this._psychologistRepo.updateById(psychologist.id, {
            averageRating: avgRating,
            totalReviews: totalRatings,
        });
    }
}
