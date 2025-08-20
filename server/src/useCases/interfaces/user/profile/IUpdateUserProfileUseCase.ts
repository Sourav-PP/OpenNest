import { IUpdateUserProfileInput, IUpdateUserProfileOutput } from '@/useCases/types/userTypes';

export interface IUpdateUserProfileUseCase {
    execute(input: IUpdateUserProfileInput): Promise<IUpdateUserProfileOutput>
}