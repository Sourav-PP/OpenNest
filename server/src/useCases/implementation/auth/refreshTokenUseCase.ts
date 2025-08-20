import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { IAuthAccountRepository } from '@/domain/repositoryInterface/IAuthAccountRepository';
import { AppError } from '@/domain/errors/AppError';
import { IRefreshTokenUseCase } from '@/useCases/interfaces/auth/IRefreshTokenUseCase';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { userMessages } from '@/shared/constants/messages/userMessages';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    private _tokenService: ITokenService;
    private _accountRepository: IAuthAccountRepository;

    constructor(
        tokenService: ITokenService,
        accountRepository: IAuthAccountRepository,
    ) {
        this._tokenService = tokenService;
        this._accountRepository = accountRepository;
    }

    async execute(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = this._tokenService.verifyRefreshToken(refreshToken);
        if (!payload) {
            throw new AppError(authMessages.ERROR.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        const user = await this._accountRepository.findById(payload.userId);
        if (!user) {
            throw new AppError(userMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const newAccessToken = this._tokenService.generateAccessToken(
            payload.userId,
            user.role,
            user.email,
        );

        return {
            accessToken: newAccessToken,
        };
    }
}
