import { IPsychologistRepository } from '../../../../domain/interfaces/IPsychologistRepository';
import { IKycRepository } from '../../../../domain/interfaces/IKycRepository';
import { Psychologist } from '../../../../domain/entities/Psychologist';
import { IVerifyProfileInput, IVerifyProfileOutput } from '../../../types/psychologistTypes';
import { IVerfiyPsychologistUseCase } from '../../../interfaces/psychologist/profile/IVerifyPsychologistUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class VerifyPsychologistUseCase implements IVerfiyPsychologistUseCase {
    constructor(
        private psychologistRepository: IPsychologistRepository,
        private kycRepository: IKycRepository,
    ) {}

    async execute(req: IVerifyProfileInput): Promise<IVerifyProfileOutput> {
        const {
            userId,
            identificationDoc,
            educationalCertification,
            experienceCertificate,
            ...profileData
        } = req;

        const existingPsychologist = await this.psychologistRepository.findById(userId);
        let psychologist: Psychologist | null;

        if (existingPsychologist) {
            psychologist = await this.psychologistRepository.updateByUserId(userId, {
                ...profileData,
                isVerified: false,
            });

            await this.kycRepository.updateByPsychologistId(existingPsychologist.id,{
                identificationDoc,
                educationalCertification,
                experienceCertificate,
                kycStatus: 'pending',
            });
        } else {

            psychologist = await this.psychologistRepository.create({ userId, ...profileData, isVerified: false });
    
            await this.kycRepository.create({
                psychologistId: psychologist.id!,
                identificationDoc,
                educationalCertification,
                experienceCertificate,
                kycStatus: 'pending',
            });
        }

        if (!psychologist) {
            throw new AppError('Psychologist creation or updation failed');
        }

        console.log('psycholgist: ', psychologist);

        const kyc = await this.kycRepository.findByPsychologistId(psychologist.id!);

        if (!kyc) {
            console.log('kyc is not here');
            throw new AppError('KYC not found after creation');
        }

        return {
            psychologist,
            kyc,
        };
    }
}