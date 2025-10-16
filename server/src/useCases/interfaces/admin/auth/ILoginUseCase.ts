import { IAdminLoginRequest, IAdminLoginResponse } from '@/useCases/types/adminTypes';

export interface IAdminLoginUseCase {
    execute(input: IAdminLoginRequest): Promise<IAdminLoginResponse>;
}
