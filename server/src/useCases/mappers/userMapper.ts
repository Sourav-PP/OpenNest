import { User } from '@/domain/entities/user';
import { ILoginOutputDto, IUserDto, IUserUpdatedDto } from '../dtos/user';

export function toUserDetailDto(user: IUserDto): IUserDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage || '',
        dateOfBirth: user.dateOfBirth || undefined, 
        gender: user.gender || undefined,
        isActive: user.isActive !== undefined ? user.isActive : true,
    };
};

export function toUserUpdatedDto(user: User): IUserUpdatedDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage || '',
        dateOfBirth: user.dateOfBirth || undefined, 
        gender: user.gender || undefined,
    };
};

export function toLoginOutputDto(user: User, accessToken: string, refreshToken: string, hasSubmittedVerificationForm: boolean): ILoginOutputDto {
    return {
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
        },
        accessToken,
        refreshToken,
        hasSubmittedVerificationForm,
    };
}