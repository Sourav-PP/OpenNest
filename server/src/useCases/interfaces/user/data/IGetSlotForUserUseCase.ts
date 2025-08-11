import { ISlotDto } from "../../../../domain/dtos/slot";
import { IGetSlotForUsertInput } from "../../../types/userTypes";

export interface IGetSlotForUserUseCase {
    execute(input: IGetSlotForUsertInput): Promise<ISlotDto[]>
}