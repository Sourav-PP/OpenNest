import { IUser } from "../../domain/entities/user";
import { AuthService } from "../../domain/interfaces/authService";
import { TokenService } from "../../domain/interfaces/tokenService";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { SignupRequest, SignupResponse } from "./signupTypes";
import { IOtpService } from "../../domain/interfaces/otpService";

export class SignupUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private tokenService: TokenService,
        private otpService: IOtpService
    ) {}

    async execute(request: SignupRequest): Promise<SignupResponse> {
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

        const user: IUser = {
            name: request.name,
            email: request.email,
            phone: request.phone,
            password: hashPassword,
            role: request.role,
            isActive: true,
        }

        const savedUser = await this.userRepository.create(user)
        console.log('saved user: ', savedUser)

        // generate tokens
        const accessToken = this.tokenService.generateAccessToken(savedUser._id!, savedUser.role, savedUser.email)
        const refreshToken = this.tokenService.generateRefreshToken(savedUser._id!, savedUser.role, savedUser.email)

        return {
            user: {
                id: savedUser._id!.toString(),
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            },
            accessToken,
            refreshToken,
        }
    }
}