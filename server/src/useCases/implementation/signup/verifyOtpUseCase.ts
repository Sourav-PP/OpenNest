import { AppError } from '../../../domain/errors/AppError';
import { IOtpService } from '../../../domain/interfaces/IOtpService';
import { ITokenService } from '../../../domain/interfaces/ITokenService';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { IAuthService } from '../../../domain/interfaces/IAuthService';
import { User } from '../../../domain/entities/user';
import { IVerifyOtpOutput } from '../../types/authTypes';

export class VerifyOtpUseCase {
    constructor(
        private otpService: IOtpService,
        private tokenService: ITokenService,
        private userRepo: IUserRepository,
        private authService: IAuthService,
    ) {}

    async execute(email: string, otp: string, signupToken: string): Promise<IVerifyOtpOutput> {
        console.log('signup token from frontend: ', signupToken);

        const payload = this.tokenService.verifySignupToken(signupToken);

        if (email !== payload?.email) {
            throw new AppError('Email does not match', 400);
        }

        const isValidOtp = await this.otpService.verifyOtp(email, otp);
        console.log('isvalid: ', isValidOtp);

        if (!isValidOtp) {
            throw new AppError('Invalid otp', 400);
        }

        const pending = await this.userRepo.findPendingSignup(email);
        if (!pending) {
            throw new AppError('No pending user', 404);
        }

        const hashedPassword = await this.authService.hashPassword(pending.password!);

        const newUser: User = {
            name: pending.name,
            email: pending.email,
            phone: pending.phone,
            password: hashedPassword,
            role: pending.role,
            isActive: true,
            profileImage: pending.profileImage,
        };

        const savedUser = await this.userRepo.create(newUser);
        await this.userRepo.deletePendingSignup(email);

        const accessToken = this.tokenService.generateAccessToken(savedUser.id!,savedUser.role, savedUser.email);
        const refreshToken = this.tokenService.generateRefreshToken(savedUser.id!,savedUser.role, savedUser.email);

        return {
            user: {
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                profileImage: savedUser.profileImage!,
            },
            accessToken,
            refreshToken,
        };
    }
}