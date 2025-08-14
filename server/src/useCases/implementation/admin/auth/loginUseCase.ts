import { IAdminRepository } from '../../../../domain/interfaces/IAdminRepository';
import { IAuthService } from '../../../../domain/interfaces/IAuthService';
import { ITokenService } from '../../../../domain/interfaces/ITokenService';
import { IAdminLoginResponse, IAdminLoginRequest } from '../../../types/adminTypes';
import { IAdminLoginUseCase } from '../../../interfaces/admin/auth/ILoginUseCase';
import { AppError } from '../../../../domain/errors/AppError';

export class AdminLoginUseCase implements IAdminLoginUseCase {
    constructor(
        private adminRepository: IAdminRepository,
        private tokenService: ITokenService,
        private authService: IAuthService,
    ) {}

    async execute(request: IAdminLoginRequest): Promise<IAdminLoginResponse> {

        const admin = await this.adminRepository.findByEmail(request.email);
        if (!admin) {
            throw new AppError('Invalid email or password', 401);
        }

        const isMatch = await this.authService.comparePassword(request.password, admin.password);
        if (!isMatch) {
            throw new AppError('Invalid email or password', 401);
        }

        const accessToken = this.tokenService.generateAccessToken(admin.id!, 'admin', admin.email);
        const refreshToken = this.tokenService.generateRefreshToken(admin.id!, 'admin', admin.email);

        return {
            accessToken,
            refreshToken,
        };
    }
}