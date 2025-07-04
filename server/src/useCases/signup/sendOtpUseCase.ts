import { IOtpService } from "../../domain/interfaces/otpService";

export class SendOtpUseCase {
    constructor(private otpService: IOtpService){}

    async execute(email: string): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        await this.otpService.sendOtp(email, otp)
    }
}