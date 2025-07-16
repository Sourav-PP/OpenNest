import { Request, Response } from "express";
import { GetAllPsychologistUseCasee } from "../../../../useCases/user/getPsychologists/getAllPsychologistUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class GetAllPsychologistsController {
    constructor(private getAllPsychologistUseCase: GetAllPsychologistUseCasee) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const psychologists = await this.getAllPsychologistUseCase.execute()
            console.log('psychologists: ', psychologists)
            res.status(200).json(psychologists)
            return 
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}