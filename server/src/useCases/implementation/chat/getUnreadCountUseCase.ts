import { UserRole } from '@/domain/enums/UserEnums';
import { AppError } from '@/domain/errors/AppError';
import { IMessageRepository } from '@/domain/repositoryInterface/IMessageRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';
import { userMessages } from '@/shared/constants/messages/userMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IGetUnreadCountUseCase } from '@/useCases/interfaces/chat/IGetUnreadCountUseCase';

export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {
    private _messageRepo: IMessageRepository;
    private _userRepo: IUserRepository;
    private _psychologistRepo: IPsychologistRepository;

    constructor(messageRepo: IMessageRepository, userRepo: IUserRepository, psychologistRepo: IPsychologistRepository) {
        this._messageRepo = messageRepo;
        this._userRepo = userRepo;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(roomId: string, userId: string): Promise<number> {
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

        return await this._messageRepo.countUnread(roomId, receiverId);
    }
}
