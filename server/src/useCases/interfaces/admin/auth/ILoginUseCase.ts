import { IAdminLoginRequest, IAdminLoginResponse } from '../../../types/adminTypes';

export interface IAdminLoginUseCase {
    execute(input: IAdminLoginRequest): Promise<IAdminLoginResponse>
}