import { TokenService } from "../../domain/interfaces/tokenService";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { AppError } from "../../domain/errors/AppError";

export class RefreshTokenUseCase {
    constructor(
        private tokenService: TokenService,
        private userRepository: UserRepository
    ) {}

    async execute(refreshToken: string): Promise<{accessToken: string}> {
        const payload = this.tokenService.verifyRefreshToken(refreshToken)
        if(!payload) {
            throw new AppError("Invalid refresh token", 403)
        }

        const user = await this.userRepository.findById(payload.userId)
        if(!user) {
            throw new AppError("User not found", 404)
        }

        const newAccessToken = this.tokenService.generateAccessToken(payload.userId, user.role)

        return {
            accessToken: newAccessToken
        }
    }
}