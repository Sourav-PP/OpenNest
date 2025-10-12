import { PayoutRequest } from '@/domain/entities/payoutRequest';
import { PayoutRequestListItemDto } from '../dtos/payoutRequest';
import { User } from '@/domain/entities/user';

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
