import { User } from '@/domain/entities/user';
import { ILoginOutputDto, IUserDto, IUserUpdatedDto } from '../dtos/user';
import { Notification } from '@/domain/entities/notification';
import { INotificationDto } from '../dtos/notification';

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

export function toNotificationDto(notification: Notification): INotificationDto {
    return {
        id: notification.id,
        message: notification.message,
        type: notification.type,
        consultationId: notification.consultationId,
        read: notification.read,
    };
}