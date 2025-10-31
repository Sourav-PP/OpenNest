import { IEnsureMembershipUseCase } from '@/useCases/interfaces/chat/IEnsureMembershipUseCase';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { chatMessages } from '@/shared/constants/messages/chatMessages';

export class EnsureMembershipUseCase implements IEnsureMembershipUseCase {

    async execute(userId: string, roomId: string): Promise<void> {
        const parts = roomId.split('_');

        if (parts.length !== 3) {
            throw new AppError(chatMessages.ERROR.INVALID_ROOM_ID, HttpStatus.BAD_REQUEST);
        }

        const [_, userA, userB] = parts;
        // Ensure the current user belongs to this room
        if (userId !== userA && userId !== userB) {
            throw new AppError(authMessages.ERROR.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
        }
        return;
    }
}
