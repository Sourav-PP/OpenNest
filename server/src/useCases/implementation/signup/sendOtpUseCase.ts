import { IOtpService } from '@/domain/serviceInterface/IOtpService';
import { ISendOtpUseCase } from '@/useCases/interfaces/signup/ISendOtpUseCase';

export class SendOtpUseCase implements ISendOtpUseCase {
    private _otpService: IOtpService;

    constructor(otpService: IOtpService){
        this._otpService = otpService;
    }

    async execute(email: string): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this._otpService.sendOtp(email, otp);
    }
}