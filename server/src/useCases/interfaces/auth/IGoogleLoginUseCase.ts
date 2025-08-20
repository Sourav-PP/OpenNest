import { IGoogleLoginInput } from '@/useCases/types/authTypes';
import { ILoginOutputDto } from '@/useCases/dtos/user';

export interface IGoogleLoginUseCase {
    execute(input: IGoogleLoginInput): Promise<ILoginOutputDto>
}