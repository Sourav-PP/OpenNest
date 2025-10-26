import nodemailer from 'nodemailer';
import { IOtpService } from '../../domain/serviceInterface/IOtpService';
import { IOtpRepository } from '../../domain/repositoryInterface/IOtpRepository';
import { otpEmailTemplate } from '@/shared/emailTemplates';

export class NodemailerOtpService implements IOtpService {
    private _otpRepo: IOtpRepository;

    constructor(otpRepo: IOtpRepository){
        this._otpRepo = otpRepo;
    }

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
            await this._otpRepo.saveOtp(email, otp);

            await this._transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP Code',
                html: otpEmailTemplate(otp),
            });

            console.log('otp send or not');
        } catch (error) {
            console.log('error otp: ', error);
        }
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        console.log('otp in serviedjfldkfjd: ', otp);
        console.log('emai l in serfvd: ', email);
        return await this._otpRepo.verifyOtp(email, otp);
    }

    async isVerified(email: string): Promise<boolean> {
        return await this._otpRepo.isVerified(email);    
    }
}
