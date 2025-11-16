import { AppError } from '@/domain/errors/AppError';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { IOtpService } from '@/domain/serviceInterface/IOtpService';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { ISendForgotPasswordOtpUseCase } from '@/useCases/interfaces/auth/ISendForgotPasswordOtpUseCase';

export class SendForgotPasswordOtpUseCase implements ISendForgotPasswordOtpUseCase {
    private _otpService: IOtpService;
    private _userRepo: IUserRepository;

    constructor(otpService: IOtpService, userRepo: IUserRepository) {
        this._otpService = otpService;
        this._userRepo = userRepo;
    }

    async execute(email: string): Promise<void> {
        const user = await this._userRepo.findByEmail(email);
        if (!user) {
            throw new AppError(authMessages.ERROR.EMAIL_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this._otpService.sendOtp(email, otp);
    }
}
