import { IMarkReadUseCase } from '@/useCases/interfaces/chat/IMarkReadUseCase';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { AppError } from '@/domain/errors/AppError';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { UserRole } from '@/domain/enums/UserEnums';

export class MarkReadUseCase implements IMarkReadUseCase {
    private _messageRepo: IMessageRepository;
    private _psychologistRepo: IPsychologistRepository;
    private _userRepo: IUserRepository;

    constructor(messageRepo: IMessageRepository, psychologistRepo: IPsychologistRepository, userRepo: IUserRepository) {
        this._messageRepo = messageRepo;
        this._psychologistRepo = psychologistRepo;
        this._userRepo = userRepo;
    }

    async execute(roomId: string, userId: string): Promise<void> {
        const user = await this._userRepo.findById(userId);

        if (!user) {
            throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        let receiverId: string;

        if (user.role === UserRole.USER) {
            receiverId = userId;
        } else if (user.role === UserRole.PSYCHOLOGIST) {
            const psychologist = await this._psychologistRepo.findByUserId(userId);

            if (!psychologist) {
                throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            receiverId = psychologist.id;
        } else {
            throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        await this._messageRepo.markAllAsRead(roomId, receiverId);
    }
}
