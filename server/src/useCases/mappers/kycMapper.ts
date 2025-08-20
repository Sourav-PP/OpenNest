import { IKycDto } from '../dtos/kyc';
import { Kyc } from '@/domain/entities/kyc';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';

export function toKycDto(kyc: Kyc, psychologist: Psychologist, user: User): IKycDto {
    return {
        id: kyc.id,
        psychologistId: kyc.psychologistId,
        psychologistName: user.name,
        psychologistEmail: user.email,
        qualification: psychologist.qualification,
        profileImage: user.profileImage || '',
        identificationDoc: kyc.identificationDoc,
        educationalCertification: kyc.educationalCertification,
        experienceCertificate: kyc.experienceCertificate,
        status: kyc.kycStatus,
    };
}