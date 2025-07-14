import { AuthService } from "../../../domain/interfaces/authService";
import { TokenService } from "../../../domain/interfaces/tokenService";
import { UserRepository } from "../../../domain/interfaces/userRepository";
import { LoginRequest, LoginResponse } from "./loginTypes";
import { AppError } from "../../../domain/errors/AppError";

export class LoginUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private tokenService: TokenService
    ) {}

    async execute(request: LoginRequest): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(request.email)
        if(!user) {
            throw new AppError("Invalid email or password", 401)
        }

        const isMatch = await this.authService.comparePassword(request.password, user.password)
        if(!isMatch) {
            throw new AppError("Invalid email or password", 401)
        }

        if(!user.isActive) {
            throw new AppError("Account is inactive. Please contact support", 403)
        }

        const accessToken = this.tokenService.generateAccessToken(user._id!, user.role, user.email)
        const refreshToken = this.tokenService.generateRefreshToken(user._id!, user.role, user.email)
        
        return {
            user: {
                id: user._id!.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        }

    }
}