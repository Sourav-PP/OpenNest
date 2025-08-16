import { IGetUserProfileInput } from '@/useCases/types/userTypes';
import { IUserDto } from '@/useCases/dtos/user';

export interface IGetUserProfileUseCase {
    execute(input: IGetUserProfileInput): Promise<IUserDto>
}