import { ConsultationStatus } from '@/domain/enums/ConsultationEnums';
import { IConsultationRepository } from '@/domain/repositoryInterface/IConsultationRepository';
import { IPaymentRepository } from '@/domain/repositoryInterface/IPaymentRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IAdminService } from '@/domain/serviceInterface/IAdminService';
import { appConfig } from '../config/config';

export class AdminService implements IAdminService {
    private _userRepo: IUserRepository;
    private _psychologistRepo: IPsychologistRepository;
    private _consultationRepo: IConsultationRepository;
    private _paymentRepo: IPaymentRepository;

    constructor(
        userRepo: IUserRepository,
        psychologistRepo: IPsychologistRepository,
        consultationRepo: IConsultationRepository,
        paymentRepo: IPaymentRepository,
    ) {
        this._userRepo = userRepo;
        this._psychologistRepo = psychologistRepo;
        this._consultationRepo = consultationRepo;
        this._paymentRepo = paymentRepo;
    }
    /**
     *
     * @returns
     */
    async getTotals(): Promise<{ users: number; psychologists: number; consultations: number; revenue: number }> {
        const [users, psychologists, consultations, totalPaidAmount] = await Promise.all([
            this._userRepo.countAll(),
            this._psychologistRepo.countAllVerified(),
            this._consultationRepo.countAll({ search: '', status: ConsultationStatus.COMPLETED }),
            this._paymentRepo.sumPaidAmounts(),
        ]);

        const revenue = +(totalPaidAmount * (appConfig.stripe.commissionPercentage / 100)).toFixed(2);
        console.log('totalAmount: ', totalPaidAmount);
        return {
            users,
            psychologists,
            consultations,
            revenue,
        };
    }
}
