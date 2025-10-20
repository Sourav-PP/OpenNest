import { IApproveKycUseCase } from '@/useCases/interfaces/admin/management/IApproveKycUseCase';
import { IKycRepository } from '@/domain/repositoryInterface/IKycRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { AppError } from '@/domain/errors/AppError';
import { adminMessages } from '@/shared/constants/messages/adminMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { INotificationService } from '@/domain/serviceInterface/INotificationService';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { NotificationType } from '@/domain/enums/NotificationEnums';

export class ApproveKycUseCase implements IApproveKycUseCase {
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

    async execute(psychologistId: string): Promise<void> {
        if (!psychologistId) {
            throw new AppError(adminMessages.ERROR.PSYCHOLOGIST_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const psychologist = await this._psychologistRepo.findById(psychologistId);
        if (!psychologist) throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);

        await this._kycRepo.approveKyc(psychologistId);

        await this._psychologistRepo.updateById(psychologistId, {
            isVerified: true,
        });

        const notificationService = this._getNotificationService();

        await notificationService.send({
            recipientId: psychologist.userId,
            type: NotificationType.KYC_APPROVED,
            message: psychologistMessages.SUCCESS.KYC_APPROVED,
        });
    }
}
