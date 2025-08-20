import { AppError } from '@/domain/errors/AppError';
import { IOtpRepository } from '@/domain/repositoryInterface/IOtpRepository';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IAuthService } from '@/domain/serviceInterface/IAuthService';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { IResetPasswordUseCase } from '@/useCases/interfaces/auth/IResetPasswordUseCase';

export class ResetPasswordUseCase implements IResetPasswordUseCase {
    private _otpRepository: IOtpRepository;
    private _userRepository: IUserRepository;
    private _authService: IAuthService;

    constructor(
        otpRepository: IOtpRepository,
        userRepository: IUserRepository,
        authService: IAuthService,
    ) {
        this._otpRepository = otpRepository;
        this._userRepository = userRepository;
        this._authService = authService;
    }

    async execute(email: string, password: string): Promise<void> {
        const isVerified = await this._otpRepository.isVerified(email);

        if (!isVerified) throw new AppError(authMessages.ERROR.EMAIL_NOT_VERIFIED);
        
        const hashed = await this._authService.hashPassword(password);
        await this._userRepository.updatePassword(email, hashed);

        await this._otpRepository.removeOtp(email);
    }
}
