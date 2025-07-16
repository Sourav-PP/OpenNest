import { Request, Response } from "express";
import { GetAllServiceUseCase } from "../../../../useCases/user/services/getAllServicesUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class GetAllServicesController {
    constructor(private getAllServicesUseCase: GetAllServiceUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            console.log('its here in service controller')
            const services = await this.getAllServicesUseCase.execute()
            res.status(200).json(services)
            return
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}