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
            throw new Error("User with this email already exists")
        } 

        if(request.password !== request.confirmPassword) {
            throw new Error("Password do not match")
        }

        const isVerified = await this.otpService.isVerified(request.email);
        if (!isVerified) {
            throw new Error("Email not verified with OTP");
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
        const accessToken = this.tokenService.generateAccessToken(savedUser._id!, savedUser.role)
        const refreshToken = this.tokenService.generateRefreshToken(savedUser._id!, savedUser.role)

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