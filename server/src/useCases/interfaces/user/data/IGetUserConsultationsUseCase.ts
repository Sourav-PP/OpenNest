import { IConsultationDto } from "../../../../domain/dtos/consultation";
import { IGetConsultationsRequest, IGetConsultationsResponse } from "../../../types/userTypes";

export interface IGetUserConsultationUseCase {
    execute(input: IGetConsultationsRequest): Promise<IGetConsultationsResponse>
}