import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import { IGoogleAuthService } from "../../../domain/interfaces/IGoogleAuthService";import { IGoogleLoginUseCase } from "../../interfaces/auth/IGoogleLoginUseCase";
import { IGoogleLoginInput, IGoogleLoginOutput } from "../../types/authTypes";
import { AppError } from "../../../domain/errors/AppError";
import { User } from "../../../domain/entities/user";
import { ITokenService } from "../../../domain/interfaces/ITokenService";
import { IPsychologistRepository } from "../../../domain/interfaces/IPsychologistRepository";


export class GoogleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        private tokenService: ITokenService,
        private userRepo: IUserRepository,
        private googleAuth: IGoogleAuthService,
        private psychologistRepo: IPsychologistRepository
    ) {}

    async execute(input: IGoogleLoginInput): Promise<IGoogleLoginOutput> {
        const {credential, role} = input

        const payload = await this.googleAuth.verifyToken(credential)

        if(!payload || !payload.email) {
            throw new AppError("Ivalid google token", 404)
        }

        const {email, name, picture, sub: googleId} = payload

        let user = await this.userRepo.findByEmail(email)

        if(!user) {
            const newUser: User = {
                name: name || "Google User",
                email: email,
                role: role,
                isActive: true,
                profileImage: picture,
                googleId
            }

            user = await this.userRepo.create(newUser)
        }

        if(!user.isActive) {
            throw new AppError("Account is inactive. Please contact support", 403)
        }

        const accessToken = this.tokenService.generateAccessToken(user.id!, user.role, user.email )
        const refreshToken = this.tokenService.generateRefreshToken(user.id!, user.role, user.email )

        let hasSubmittedVerificationForm = false

        if(user.role === 'psychologist') {
            const psychologist = await this.psychologistRepo.findByUserId(user.id!)
            if(psychologist) {
                hasSubmittedVerificationForm = true
            }
        }
        
        return {
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage!
            },
            accessToken,
            refreshToken,
            hasSubmittedVerificationForm
        }
    }
}