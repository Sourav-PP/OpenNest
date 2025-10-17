import { ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IUpdateMissedConsultationUseCase } from '@/useCases/interfaces/admin/management/IUpdateMissedConsultationsUseCase';

export class UpdateMissedConsultationUseCase implements IUpdateMissedConsultationUseCase {
    private _consultationRepository: IConsultationRepository;

    constructor(consultationRepository: IConsultationRepository) {
        this._consultationRepository = consultationRepository;
    }

    async execute(): Promise<void> {
        const now = new Date();

        const missedConsultations = await this._consultationRepository.findMissedConsultation(now);

        for (const consultation of missedConsultations) {
            await this._consultationRepository.markAsMissed(consultation.id, {
                status: ConsultationStatus.MISSED,
                includedInPayout: false,
                cancelledAt: now,
                cancellationReason: 'Session not attended',
            });
        }
    }
}
