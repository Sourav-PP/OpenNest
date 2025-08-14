import { IUpdateUserProfileInput, IUpdateUserProfileOutput } from '../../../types/userTypes';

export interface IUpdateUserProfileUseCase {
    execute(input: IUpdateUserProfileInput): Promise<IUpdateUserProfileOutput>
}