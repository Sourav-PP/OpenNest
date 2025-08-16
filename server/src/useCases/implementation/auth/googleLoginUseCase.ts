import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IGoogleAuthService } from '@/domain/serviceInterface/IGoogleAuthService';
import { IGoogleLoginUseCase } from '@/useCases/interfaces/auth/IGoogleLoginUseCase';
import { IGoogleLoginInput } from '@/useCases/types/authTypes';
import { AppError } from '@/domain/errors/AppError';
import { User } from '@/domain/entities/user';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { IPsychologistRepository } from '@/domain/repositoryInterface/IPsychologistRepository';
import { toLoginOutputDto } from '@/useCases/mappers/userMapper';
import { ILoginOutputDto } from '@/useCases/dtos/user';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { adminMessages } from '@/shared/constants/messages/adminMessages';


export class GoogleLoginUseCase implements IGoogleLoginUseCase {
    private _tokenService: ITokenService;
    private _userRepo: IUserRepository;
    private _googleAuthService: IGoogleAuthService;
    private _psychologistRepo: IPsychologistRepository;

    constructor(
        tokenService: ITokenService,
        userRepo: IUserRepository,
        googleAuthService: IGoogleAuthService,
        psychologistRepo: IPsychologistRepository,
    ) {
        this._tokenService = tokenService;
        this._userRepo = userRepo;
        this._googleAuthService = googleAuthService;
        this._psychologistRepo = psychologistRepo;
    }

    async execute(input: IGoogleLoginInput): Promise<ILoginOutputDto> {
        const { credential, role } = input;

        const payload = await this._googleAuthService.verifyToken(credential);

        if (!payload || !payload.email) {
            throw new AppError(authMessages.ERROR.INVALID_GOOGLE_TOKEN, HttpStatus.UNAUTHORIZED);
        }

        const { email, name, picture, sub: googleId } = payload;

        let user = await this._userRepo.findByEmail(email);

        console.log('user: ', user);

        if (!user) {
            const newUser: Omit<User, 'id'> = {
                name: name || 'Google User',
                email: email,
                role: role,
                isActive: true,
                profileImage: picture,
                googleId,
            };

            user = await this._userRepo.create(newUser);
        } else if (!user.googleId) {
            user.googleId = googleId;
            await this._userRepo.updateProfile(user.id, { googleId });
        } else {
            throw new AppError(authMessages.ERROR.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
        }

        if (!user.isActive) {
            throw new AppError(authMessages.ERROR.BLOCKED_USER, HttpStatus.FORBIDDEN);
        }

        if (!user.id) {
            throw new AppError(adminMessages.ERROR.USER_ID_REQUIRED, HttpStatus.BAD_REQUEST);
        }

        const accessToken = this._tokenService.generateAccessToken(user.id, user.role, user.email );
        const refreshToken = this._tokenService.generateRefreshToken(user.id, user.role, user.email );

        let hasSubmittedVerificationForm = false;

        if (user.role === 'psychologist') {
            const psychologist = await this._psychologistRepo.findByUserId(user.id);
            if (psychologist) {
                hasSubmittedVerificationForm = true;
            }
        }

        return toLoginOutputDto(user, accessToken, refreshToken, hasSubmittedVerificationForm);
    }
}