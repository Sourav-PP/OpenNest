import { AppError } from '@/domain/errors/AppError';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetPsychologistTotalsUseCase } from '@/useCases/interfaces/psychologist/data/IGetPsychologistTotalsUseCase';

export class GetPsychologistTotalsUseCase implements IGetPsychologistTotalsUseCase {
    private _psychologistRepo: IPsychologistRepository;
    private _consultationRepo: IConsultationRepository;

    constructor(psychologistRepo: IPsychologistRepository, consultationRepo: IConsultationRepository) {
        this._psychologistRepo = psychologistRepo;
        this._consultationRepo = consultationRepo;
    }

    async execute(userId: string): Promise<{ totalConsultations: number; totalPatients: number }> {
        const psychologist = await this._psychologistRepo.findByUserId(userId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        const totalConsultations = await this._consultationRepo.countCompletedByPsychologistId(psychologist.id);
        const totalPatients = await this._consultationRepo.countUniquePatientsByPsychologistId(psychologist.id);

        return {
            totalConsultations,
            totalPatients,
        };
    }
}
