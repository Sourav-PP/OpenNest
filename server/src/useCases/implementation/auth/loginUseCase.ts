import { IAuthService } from "../../../domain/interfaces/IAuthService";
import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IPsychologistRepository } from "../../../domain/interfaces/IPsychologistRepository";
import { ILoginUseCase } from "../../interfaces/auth/ILoginUseCase";
import { ILoginInput, ILoginOutput } from "../../types/authTypes";
import { AppError } from "../../../domain/errors/AppError";

export class LoginUseCase implements ILoginUseCase {
    constructor(
        private userRepository: IUserRepository,
        private authService: IAuthService,
        private tokenService: ITokenService,
        private psychologistRepository: IPsychologistRepository
    ) {}

    async execute(request: ILoginInput): Promise<ILoginOutput> {
        const user = await this.userRepository.findByEmail(request.email)
        if(!user) {
            throw new AppError("Invalid email or password", 401)
        }

        const isMatch = await this.authService.comparePassword(request.password, user.password!)
        if(!isMatch) {
            throw new AppError("Invalid email or password", 401)
        }

        if(!user.isActive) {
            throw new AppError("Account is inactive. Please contact support", 403)
        }

        const accessToken = this.tokenService.generateAccessToken(user.id!, user.role, user.email)
        const refreshToken = this.tokenService.generateRefreshToken(user.id!, user.role, user.email)

        let hasSubmittedVerificationForm = false

        if(user.role === 'psychologist') {
            const psychologist = await this.psychologistRepository.findByUserId(user.id!)
            if(psychologist) {
                hasSubmittedVerificationForm = true
            }
        }
        
        return {
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken,
            hasSubmittedVerificationForm
        }

    }
}