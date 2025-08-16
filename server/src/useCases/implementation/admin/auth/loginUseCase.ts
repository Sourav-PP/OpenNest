import { IAdminRepository } from '@/domain/repositoryInterface/IAdminRepository';
import { IAuthService } from '@/domain/serviceInterface/IAuthService';
import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { IAdminLoginResponse, IAdminLoginRequest } from '@/useCases/types/adminTypes';
import { IAdminLoginUseCase } from '@/useCases/interfaces/admin/auth/ILoginUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';

export class AdminLoginUseCase implements IAdminLoginUseCase {
    private _adminRepository: IAdminRepository;
    private _tokenService: ITokenService;
    private _authService: IAuthService;

    constructor(
        adminRepository: IAdminRepository,
        tokenService: ITokenService,
        authService: IAuthService,
    ) {
        this._adminRepository = adminRepository;
        this._tokenService = tokenService;
        this._authService = authService;
    }

    async execute(request: IAdminLoginRequest): Promise<IAdminLoginResponse> {

        const admin = await this._adminRepository.findByEmail(request.email);
        if (!admin) {
            throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        const isMatch = await this._authService.comparePassword(request.password, admin.password);
        if (!isMatch) {
            throw new AppError(authMessages.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
        }

        const accessToken = this._tokenService.generateAccessToken(admin.id, 'admin', admin.email);
        const refreshToken = this._tokenService.generateRefreshToken(admin.id, 'admin', admin.email);

        return {
            accessToken,
            refreshToken,
        };
    }
}