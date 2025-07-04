import { IOtpRepository } from "../../domain/interfaces/otpRepository";
import { OtpModel } from "../database/models/OtpModels";

export class MongoOtpRepository implements IOtpRepository {
    async saveOtp(email: string, otp: string): Promise<void> {
         await OtpModel.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const record = await OtpModel.findOne({ email })
        const isValid = record?.otp === otp
        
        if(isValid) {
            await OtpModel.updateOne({email}, { verified: true})
        }
        return isValid
    }

    async isVerified(email: string): Promise<boolean> {
        const record = await OtpModel.findOne({ email, verified: true })    
        return !!record
    }

    async removeOtp(email: string): Promise<void> {
        await OtpModel.deleteOne({ email });
    }
}