import { Request, Response } from "express";
import { GetAllPsychologistUseCasee } from "../../../../useCases/implementation/user/data/getAllPsychologistUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class GetAllPsychologistsController {
    constructor(private getAllPsychologistUseCase: GetAllPsychologistUseCasee) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const psychologists = await this.getAllPsychologistUseCase.execute()
            const response = {
                psychologists,
                totalCount: psychologists.length
            }
            res.status(200).json(response)
            return 
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}