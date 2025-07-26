export interface IOtpService {
    sendOtp(email: string, otp: string): Promise<void>
    verifyOtp(email: string, otp: string): Promise<boolean>
    isVerified(email: string): Promise<boolean>
}