import cron from 'node-cron';
import { IUpdateMissedConsultationUseCase } from '@/useCases/interfaces/admin/management/IUpdateMissedConsultationsUseCase';

export class ConsultationMissedJob {
    private _updateMissedConsultationsUseCase: IUpdateMissedConsultationUseCase;

    constructor(
        updateMissedConsultationsUseCase: IUpdateMissedConsultationUseCase,
    ) {
        this._updateMissedConsultationsUseCase = updateMissedConsultationsUseCase;
    }

    start(): void {
        cron.schedule('*/5 * * * *', async() => {
            try {
                await this._updateMissedConsultationsUseCase.execute();
                console.log('ConsultationMissedJob Checked and updated missed consultations');
            } catch (error) {
                console.error('ConsultationMissedJob Error updating missed consultations:', error);
            }
        });
    }
}