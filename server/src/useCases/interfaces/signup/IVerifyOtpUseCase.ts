import { ILoginOutputDto } from '@/useCases/dtos/user';

export interface IVerifyOtpUseCase {
    execute(email: string, otp: string, signupToken: string): Promise<ILoginOutputDto>;
}