import { IGetAllUserRequest, IGetAllUserResponse } from '../../../types/adminTypes';

export interface IGetAllUserUseCase {
    execute(input: IGetAllUserRequest): Promise<IGetAllUserResponse>
}