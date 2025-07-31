import { User } from "../../../domain/entities/user";
import { IAuthService } from "../../../domain/interfaces/IAuthService";
import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { ISignupInput, ISignupOutput } from "../../types/signupTypes";
import { ISignupUseCase } from "../../interfaces/signup/ISignupUseCase";
import { IOtpService } from "../../../domain/interfaces/IOtpService";

export class SignupUseCase implements ISignupUseCase {
    constructor(
        private userRepository: IUserRepository,
        private authService: IAuthService,
        private tokenService: ITokenService,
        private otpService: IOtpService
    ) {}

    async execute(request: ISignupInput): Promise<ISignupOutput> {
        const existingUser = await this.userRepository.findByEmail(request.email)
        if(existingUser) {
            const error: Error & {statusCode?: number} = new Error('User with this email already exists')
            error.statusCode = 400
            throw error
        } 

        if(request.password !== request.confirmPassword) {
            const error: Error & {statusCode?: number} = new Error("Password do not match")
            error.statusCode = 400
            throw error
        }

        const isVerified = await this.otpService.isVerified(request.email);
        if (!isVerified) {
            const error: Error & {statusCode?: number} = new Error("Email not verified with OTP")
            error.statusCode = 400
            throw error
        }

        const hashPassword = await this.authService.hashPassword(request.password)

        const user: User = {
            name: request.name,
            email: request.email,
            phone: request.phone,
            password: hashPassword,
            role: request.role,
            isActive: true,
            profileImage: request.profileImage
        }

        const savedUser = await this.userRepository.create(user)
        console.log('saved user: ', savedUser)

        // generate tokens
        const accessToken = this.tokenService.generateAccessToken(savedUser.id!, savedUser.role, savedUser.email)
        const refreshToken = this.tokenService.generateRefreshToken(savedUser.id!, savedUser.role, savedUser.email)

        return {
            user: {
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                profileImage: savedUser.profileImage!
            },
            accessToken,
            refreshToken,
        }
    }
}