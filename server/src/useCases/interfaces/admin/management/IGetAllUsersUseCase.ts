import { IGetAllUserRequest, IGetAllUserResponse } from '@/useCases/types/adminTypes';

export interface IGetAllUserUseCase {
    execute(input: IGetAllUserRequest): Promise<IGetAllUserResponse>
}