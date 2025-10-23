import { PayoutRequest } from '@/domain/entities/payoutRequest';
import { PayoutRequestListItemDto } from '../dtos/payoutRequest';
import { User } from '@/domain/entities/user';
import { TopPsychologistDTO } from '../dtos/psychologist';
import { Psychologist } from '@/domain/entities/psychologist';

export function toPayoutRequestListDto(
    payoutRequest: PayoutRequest,
    psychologist: User,
): PayoutRequestListItemDto {
    return {
        id: payoutRequest.id,
        consultationIds: payoutRequest.consultationIds,
        requestedAmount: payoutRequest.requestedAmount,
        commissionAmount: payoutRequest.commissionAmount,
        payoutAmount: payoutRequest.payoutAmount,
        status: payoutRequest.status,
        createdAt: payoutRequest.createdAt,
        approvedAt: payoutRequest.approvedAt,
        rejectedAt: payoutRequest.rejectedAt,
        psychologist: {
            id: psychologist.id,
            name: psychologist.name,
            profileImage: psychologist.profileImage,
        },
    };
}

export function toTopPsychologistDto(item: {
    psychologist: Psychologist;
    user: User;
    totalConsultations: number;
}): TopPsychologistDTO {
    return {
        id: item.psychologist.id,
        userId: item.psychologist.userId,
        name: item.user.name,
        email: item.user.email,
        phone: item.user.phone,
        profileImage: item.user.profileImage,
        aboutMe: item.psychologist.aboutMe,
        qualification: item.psychologist.qualification,
        isVerified: item.psychologist.isVerified,
        defaultFee: item.psychologist.defaultFee,
        averageRating: item.psychologist.averageRating,
        totalReviews: item.psychologist.totalReviews,
        specializations: item.psychologist.specializations,
        totalConsultations: item.totalConsultations,
    };
}
