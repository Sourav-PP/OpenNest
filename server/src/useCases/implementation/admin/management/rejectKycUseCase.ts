import { IRejectKycUseCase } from '@/useCases/interfaces/admin/management/IRejectKycUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { INotificationService } from '@/domain/serviceInterface/INotificationService';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { NotificationType } from '@/domain/enums/NotificationEnums';

export class RejectKycUseCase implements IRejectKycUseCase {
    private _kycRepo: IKycRepository;
    private _psychologistRepo: IPsychologistRepository;
    private _getNotificationService: () => INotificationService;

    constructor(
        kycRepo: IKycRepository,
        psychologistRepo: IPsychologistRepository,
        getNotificationService: () => INotificationService,
    ) {
        this._kycRepo = kycRepo;
        this._psychologistRepo = psychologistRepo;
        this._getNotificationService = getNotificationService;
    }

    async execute(psychologistId: string, reason: string): Promise<void> {
        if (!psychologistId) {
            throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const psychologist = await this._psychologistRepo.findById(psychologistId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        await this._kycRepo.rejectKyc(psychologistId, reason);

        await this._psychologistRepo.updateById(psychologistId, {
            isVerified: false,
        });

        const notificationService = this._getNotificationService();
        
        await notificationService.send({
            recipientId: psychologist.userId,
            type: NotificationType.KYC_REJECTED,
            message: psychologistMessages.ERROR.KYC_REJECTED,
        });
    }
}
