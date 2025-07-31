import { IGoogleLoginInput, IGoogleLoginOutput } from "../../types/authTypes";

export interface IGoogleLoginUseCase {
    execute(input: IGoogleLoginInput): Promise<IGoogleLoginOutput>
}