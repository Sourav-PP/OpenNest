import { AppError } from '@/domain/errors/AppError';
import { IOtpService } from '@/domain/serviceInterface/IOtpService';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IAuthService } from '@/domain/serviceInterface/IAuthService';
import { User } from '@/domain/entities/user';
import { toLoginOutputDto } from '@/useCases/mappers/userMapper';
import { ILoginOutputDto } from '@/useCases/dtos/user';
import { IVerifyOtpUseCase } from '@/useCases/interfaces/signup/IVerifyOtpUseCase';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
    private _otpService: IOtpService;
    private _tokenService: ITokenService;
    private _userRepo: IUserRepository;
    private _authService: IAuthService;
    constructor(
        otpService: IOtpService,
        tokenService: ITokenService,
        userRepo: IUserRepository,
        authService: IAuthService,
    ) {
        this._otpService = otpService;
        this._tokenService = tokenService;
        this._userRepo = userRepo;
        this._authService = authService;
    }

    async execute(email: string, otp: string, signupToken: string): Promise<ILoginOutputDto> {
        if (!email || !otp || !signupToken) {
            throw new AppError(authMessages.ERROR.MISSING_FIELDS, HttpStatus.BAD_REQUEST);
        }

        const payload = this._tokenService.verifySignupToken(signupToken);

        if (email !== payload?.email) {
            throw new AppError(authMessages.ERROR.INVALID_SIGNUP_TOKEN, HttpStatus.BAD_REQUEST);
        }

        const isValidOtp = await this._otpService.verifyOtp(email, otp);

        if (!isValidOtp) {
            throw new AppError(authMessages.ERROR.INVALID_OTP, HttpStatus.BAD_REQUEST);
        }

        const pending = await this._userRepo.findPendingSignup(email);

        if (!pending || !pending.password) {
            throw new AppError(authMessages.ERROR.PENDING_SIGNUP_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const hashedPassword = await this._authService.hashPassword(pending.password);

        const newUser: Omit<User, 'id'> = {
            name: pending.name,
            email: pending.email,
            phone: pending.phone,
            password: hashedPassword,
            role: pending.role,
            isActive: true,
            profileImage: pending.profileImage,
        };

        const savedUser = await this._userRepo.create(newUser);

        if (!savedUser) {
            throw new AppError(authMessages.ERROR.USER_CREATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this._userRepo.deletePendingSignup(email);

        const accessToken = this._tokenService.generateAccessToken(
            savedUser.id,
            savedUser.role,
            savedUser.email,
            savedUser.isActive,
        );
        const refreshToken = this._tokenService.generateRefreshToken(
            savedUser.id,
            savedUser.role,
            savedUser.email,
            savedUser.isActive,
        );

        const hasSubmittedVerificationForm = false;

        return toLoginOutputDto(savedUser, accessToken, refreshToken, hasSubmittedVerificationForm);
    }
}
