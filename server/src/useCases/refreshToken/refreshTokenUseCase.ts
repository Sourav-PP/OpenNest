import { TokenService } from "../../domain/interfaces/tokenService";
import { AuthAccountRepository } from "../../domain/interfaces/authAccountRepository";
import { AppError } from "../../domain/errors/AppError";

export class RefreshTokenUseCase {
    constructor(
        private tokenService: TokenService,
        private accountRepository: AuthAccountRepository
    ) {}

    async execute(refreshToken: string): Promise<{accessToken: string}> {
        const payload = this.tokenService.verifyRefreshToken(refreshToken)
        if(!payload) {
            throw new AppError("Invalid refresh token", 403)
        }

        console.log("payload: ", payload)

        const user = await this.accountRepository.findById(payload.userId)
        if(!user) {
            throw new AppError("User not found", 404)
        }

        const newAccessToken = this.tokenService.generateAccessToken(payload.userId, user.role, user.email)
        
        return {
            accessToken: newAccessToken
        }
    }
}