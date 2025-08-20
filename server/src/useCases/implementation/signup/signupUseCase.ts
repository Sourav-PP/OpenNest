import { ITokenService } from '@/domain/serviceInterface/ITokenService';
import { IUserRepository } from '@/domain/repositoryInterface/IUserRepository';
import { ISignupInput, ISignupOutput } from '@/useCases/types/signupTypes';
import { ISignupUseCase } from '@/useCases/interfaces/signup/ISignupUseCase';
import { AppError } from '@/domain/errors/AppError';
import { authMessages } from '@/shared/constants/messages/authMessages';
import { HttpStatus } from '@/shared/enums/httpStatus';
import { IFileStorage } from '@/useCases/interfaces/IFileStorage';

export class SignupUseCase implements ISignupUseCase {
    private _tokenService: ITokenService;
    private _userRepository: IUserRepository;
    private _fileStorage: IFileStorage;

    constructor(
        userRepository: IUserRepository,
        tokenService: ITokenService,
        fileStorage: IFileStorage,
    ) {
        this._userRepository = userRepository;
        this._tokenService = tokenService;
        this._fileStorage = fileStorage;
    }

    async execute(request: ISignupInput): Promise<ISignupOutput> {
        const publicId = await this._fileStorage.upload(
            request.file.buffer,
            request.file.originalname,
            'profile_images',
        );

        console.log('public Id: ', publicId);
        const existingUser = await this._userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new AppError(authMessages.ERROR.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT);
        } 

        if (request.password !== request.confirmPassword) {
            throw new AppError(authMessages.ERROR.PASSWORDS_DO_NOT_MATCH, HttpStatus.BAD_REQUEST);
        }

        await this._userRepository.createPendingSignup({
            name: request.name,
            email: request.email,
            phone: request.phone,
            password: request.password,
            role: request.role,
            profileImage: publicId,
        });

        const signupToken = this._tokenService.generateSignupToken(request.email);

        if (!signupToken) {
            throw new AppError(authMessages.ERROR.TOKEN_GENERATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        };

        return signupToken;
    }
}