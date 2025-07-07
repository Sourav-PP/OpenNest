import { AuthService } from "../../domain/interfaces/authService";
import { TokenService } from "../../domain/interfaces/tokenService";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { LoginRequest, LoginResponse } from "./loginTypes";
import { PublicUser } from "../../domain/entities/user";

export class LoginUseCase {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private tokenService: TokenService
    ) {}

    async execute(request: LoginRequest): Promise<LoginResponse> {
        console.log("login req: ", request)
        const user = await this.userRepository.findByEmail(request.email)
        if(!user) {
            throw new Error("Invalid email or password")
        }

        const isMatch = await this.authService.comparePassword(request.password, user.password)
        if(!isMatch) {
            throw new Error("Invalid email or password")
        }

        if(!user.isActive) {
            throw new Error("Account is inactive. Please contact support")
        }

        const accessToken = this.tokenService.generateAccessToken(user._id!, user.role)
        const refreshToken = this.tokenService.generateRefreshToken(user._id!, user.role)
        
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