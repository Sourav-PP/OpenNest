import { ITopUserDto } from '@/useCases/dtos/user';

export interface IGetTopUsersUseCase {
    execute(userId: string, limit: number): Promise<ITopUserDto[]>;
}
