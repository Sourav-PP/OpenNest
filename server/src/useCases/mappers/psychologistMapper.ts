import { Kyc } from '@/domain/entities/kyc';
import { IPsychologistListDto, IPsychologistListUserDto, IPsychologistProfileDto } from '../dtos/psychologist';
import { Psychologist } from '@/domain/entities/psychologist';
import { User } from '@/domain/entities/user';

export function toPsychologistProfileDto(
    user: User,
    psychologist: Psychologist,
    specializationNames: string[],
    kyc: Kyc | null,
):IPsychologistProfileDto {
    return {
        id: psychologist.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        defaultFee: psychologist.defaultFee,
        qualification: psychologist.qualification,
        aboutMe: psychologist.aboutMe,
        specializations: specializationNames,
        profileImage: user.profileImage,
        kycStatus: kyc?.kycStatus || 'pending',
        specializationFees: psychologist.specializationFees,
    };
} 

export function toPsychologistDetailDto(
    psychologist: Psychologist,
    user: User,
): IPsychologistListDto {
    return {
        id: psychologist.id,
        aboutMe: psychologist.aboutMe,
        qualification: psychologist.qualification,
        defaultFee: psychologist.defaultFee,
        isVerified: psychologist.isVerified,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            profileImage: user.profileImage,
        },
        specializations: psychologist.specializations,
        specializationFees: psychologist.specializationFees,
    };
}

export function toPsychologistListDto(
    psychologist: Psychologist,
    user: User,
): IPsychologistListDto {
    return {
        id: psychologist.id,
        aboutMe: psychologist.aboutMe,
        qualification: psychologist.qualification,
        defaultFee: psychologist.defaultFee,
        isVerified: psychologist.isVerified,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            profileImage: user.profileImage,
        },
        specializations: psychologist.specializations,
        specializationFees: psychologist.specializationFees,
    };
}

export function toUserPsychologistListDto(
    psychologist: Psychologist,
    user: User,
): IPsychologistListUserDto {
    return {
        id: psychologist.id,
        userId: user.id,
        email: user.email,
        aboutMe: psychologist.aboutMe,
        defaultFee: psychologist.defaultFee,
        name: user.name,
        profileImage: user.profileImage,
        qualification: psychologist.qualification,
        specializations: psychologist.specializations,
        specializationFees: psychologist.specializationFees,
    };
}
