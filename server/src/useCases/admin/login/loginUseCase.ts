import { AdminRepository } from "../../../domain/interfaces/adminRepository";
import { AuthService } from "../../../domain/interfaces/authService";
import { TokenService } from "../../../domain/interfaces/tokenService";
import { AdminLoginRequest, AdminLoginResponse } from "./loginTypes";
import { AppError } from "../../../domain/errors/AppError";

export class AdminLoginUseCase {
    constructor(
        private adminRepository: AdminRepository,
        private tokenService: TokenService,
        private authService: AuthService
    ) {}

    async execute(request: AdminLoginRequest): Promise<AdminLoginResponse> {

        const admin = await this.adminRepository.findByEmail(request.email)
        if(!admin) {
            throw new AppError("Invalid email or password", 401)
        }

        const isMatch = await this.authService.comparePassword(request.password, admin.password)
        if(!isMatch) {
            throw new AppError("Invalid email or password", 401)
        }

        const accessToken = this.tokenService.generateAccessToken(admin._id!, 'admin', admin.email)
        const refreshToken = this.tokenService.generateRefreshToken(admin._id!, 'admin', admin.email)

        return {
            accessToken,
            refreshToken
        }
    }
}