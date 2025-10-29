import { Consultation } from '@/domain/entities/consultation';
import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { generalMessages } from '@/shared/constants/messages/generalMessages';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IUpdateConsultationNotesUseCase } from '@/useCases/interfaces/psychologist/data/IUpdateConsultationNotesUseCase';

export class UpdateConsultationNotesUseCase implements IUpdateConsultationNotesUseCase {
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(consultationRepo: IConsultationRepository, psychologistRepo: IPsychologistRepository) {
        this._consultationRepo = consultationRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(input: {
        consultationId: string;
        userId: string;
        privateNotes?: string;
        feedback?: string;
    }): Promise<Consultation> {
        const consultation = await this._consultationRepo.findById(input.consultationId);
        if (!consultation) {
            throw new AppError(bookingMessages.ERROR.CONSULTATION_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const psychologist = await this._psychologistRepo.findByUserId(input.userId);
        if (!psychologist) {
            throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const updated = await this._consultationRepo.updateNotes(consultation.id, {
            privateNotes: input.privateNotes,
            feedback: input.feedback,
            updatedAt: new Date(),
        });

        if (!updated) {
            throw new AppError(generalMessages.ERROR.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return updated;
    }
}
