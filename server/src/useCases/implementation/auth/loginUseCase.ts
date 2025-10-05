import { IAuthService } from '@/domain/serviceInterface/IAuthService';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { ILoginUseCase } from '@/useCases/interfaces/auth/ILoginUseCase';
import { ILoginInput, ILoginOutput } from '@/useCases/types/authTypes';
import { AppError } from '@/domain/errors/AppError';
import { toLoginOutputDto } from '@/useCases/mappers/userMapper';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { psychologistMessages } from '@/shared/constants/messages/psychologistMessages';

export class LoginUseCase implements ILoginUseCase {
    private _userRepository: IUserRepository;
    private _authService: IAuthService;
    private _tokenService: ITokenService;
    private _psychologistRepository: IPsychologistRepository;

    constructor(
        userRepository: IUserRepository,
        authService: IAuthService,
        tokenService: ITokenService,
        psychologistRepository: IPsychologistRepository,
    ) {
        this._userRepository = userRepository;
        this._authService = authService;
        this._tokenService = tokenService;
        this._psychologistRepository = psychologistRepository;
    }

    async execute(request: ILoginInput): Promise<ILoginOutput> {
        const user = await this._userRepository.findByEmail(request.email);

        if (!user || !user.password) {
            throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        const isMatch = await this._authService.comparePassword(request.password, user.password);
        if (!isMatch) {
            throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        if (!user.isActive) {
            throw new AppError(authMessages.ERROR.BLOCKED_USER, HttpStatus.FORBIDDEN);
        }

        const accessToken = this._tokenService.generateAccessToken(user.id, user.role, user.email, user.isActive);
        const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role, user.email, user.isActive);

        let hasSubmittedVerificationForm = false;

        if (user.role === 'psychologist') {
            const psychologist = await this._psychologistRepository.findByUserId(user.id);

            if (!psychologist) {
                throw new AppError(psychologistMessages.ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            hasSubmittedVerificationForm = true;
        }

        return toLoginOutputDto(user, accessToken, refreshToken, hasSubmittedVerificationForm);

    }
}