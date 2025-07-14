import { IOtpService } from "../../../domain/interfaces/otpService";

export class VerifyOtpUseCase {
    constructor(private otpService: IOtpService) {}

    async execute(email: string, otp: string): Promise<boolean> {
        return await this.otpService.verifyOtp(email, otp)
    }
}