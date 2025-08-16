import nodemailer from 'nodemailer';
import { IOtpService } from '../../domain/serviceInterface/IOtpService';
import { IOtpRepository } from '../../domain/repositoryInterface/IOtpRepository';

export class NodemailerOtpService implements IOtpService {
    constructor(private otpRepo: IOtpRepository){}

    private _transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    async sendOtp(email: string, otp: string): Promise<void> {
        try {
            console.log('email: ',email);
            console.log('otp', otp);
            await this.otpRepo.saveOtp(email, otp);

            await this._transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP Code',
                html: `<p>Your Otp is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
            });

            console.log('otp send or not');
        } catch (error) {
            console.log('error otp: ', error);
        }
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        console.log('otp in serviedjfldkfjd: ', otp);
        console.log('emai l in serfvd: ', email);
        return await this.otpRepo.verifyOtp(email, otp);
    }

    async isVerified(email: string): Promise<boolean> {
        return await this.otpRepo.isVerified(email);    
    }
}
