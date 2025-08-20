import { IOtpRepository } from '@/domain/repositoryInterface/IOtpRepository';
import { IVerifyForgotPasswordUseCase } from '@/useCases/interfaces/auth/IVerifyForgotPasswordUseCase';

export class VerifyForgotPasswordUseCase implements IVerifyForgotPasswordUseCase {
    private _otpRepository: IOtpRepository;

    constructor(otpRepository: IOtpRepository) {
        this._otpRepository = otpRepository;
    }

    async execute(email: string, otp: string): Promise<boolean> {
        return this._otpRepository.verifyOtp(email, otp);
    }
}