import { IEnsureMembershipUseCase } from '@/useCases/interfaces/chat/IEnsureMembershipUseCase';
import { Consultation } from '@/domain/entities/consultation';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { AppError } from '@/domain/errors/AppError';
import { bookingMessages } from '@/shared/constants/messages/bookingMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { chatMessages } from '@/shared/constants/messages/chatMessages';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';

export class EnsureMembershipUseCase implements IEnsureMembershipUseCase {
    private _consultationRepo: IConsultationRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(consultationRepo: IConsultationRepository, psychologistRepo: IPsychologistRepository) {
        this._consultationRepo = consultationRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(
        userId: string,
        consultationId: string,
    ): Promise<Consultation> {
        console.log('userid in membership: ', userId);

        const consultation = await this._consultationRepo.findById(consultationId);
        console.log('consultation: ', consultation);
        if (!consultation) throw new AppError(bookingMessages.ERROR.CONSULTATION_NOT_FOUND, HttpStatus.NOT_FOUND);
        let isMember = false;

        // Check if the user is the patient
        if (consultation.patientId.toString() === userId.toString()) {
            isMember = true;
        } else {
            // Check if the user is the psychologist
            const psychologist = await this._psychologistRepo.findByUserId(userId);
            if (psychologist && psychologist.id.toString() === consultation.psychologistId.toString()) {
                isMember = true;
            }
        }
        console.log('isMember: ', isMember);
        if (!isMember) throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        if (consultation.paymentStatus !== 'paid') throw new AppError(chatMessages.ERROR.NOT_PAID, HttpStatus.FORBIDDEN);
        return consultation;
    }
}