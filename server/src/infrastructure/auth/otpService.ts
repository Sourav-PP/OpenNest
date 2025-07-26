import nodemailer from 'nodemailer'
import { IOtpService } from '../../domain/interfaces/IOtpService'
import { IOtpRepository } from '../../domain/interfaces/IOtpRepository'

export class NodemailerOtpService implements IOtpService {
    constructor(private otpRepo: IOtpRepository){}

    private transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    async sendOtp(email: string, otp: string): Promise<void> {
        await this.otpRepo.saveOtp(email, otp)

        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            html: `<p>Your Otp is <b>${otp}</b>. It will expire in 5 minutes.</p>`
        })
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        return await this.otpRepo.verifyOtp(email, otp)
    }

    async isVerified(email: string): Promise<boolean> {
        return await this.otpRepo.isVerified(email)    
    }
}
