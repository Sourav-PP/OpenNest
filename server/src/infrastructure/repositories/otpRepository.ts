import { IOtpRepository } from '../../domain/interfaces/IOtpRepository';
import { OtpModel } from '../database/models/user/OtpModels';

export class OtpRepository implements IOtpRepository {
    async saveOtp(email: string, otp: string): Promise<void> {
        await OtpModel.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true },
        );
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        console.log('its verify otp repo');
        console.log('otp in repo');
        console.log('email in repo: ', email);
        const record = await OtpModel.findOne({ email });
        console.log('record in repo: ', record);
        const isValid = record?.otp === otp;
        
        if (isValid) {
            console.log('ist valid otp');
            await OtpModel.updateOne({ email }, { verified: true });
        }
        return isValid;
    }

    async isVerified(email: string): Promise<boolean> {
        const record = await OtpModel.findOne({ email, verified: true });    
        return !!record;
    }

    async removeOtp(email: string): Promise<void> {
        await OtpModel.deleteOne({ email });
    }
}