import { IGetUserProfileInput, IGetUserProfileOutput } from '../../../types/userTypes';

export interface IGetUserProfileUseCase {
    execute(input: IGetUserProfileInput): Promise<IGetUserProfileOutput>
}