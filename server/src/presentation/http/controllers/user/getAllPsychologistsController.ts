import { Request, Response } from "express";
import { GetAllPsychologistUseCasee } from "../../../../useCases/implementation/user/data/getAllPsychologistUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class GetAllPsychologistsController {
    constructor(private getAllPsychologistUseCase: GetAllPsychologistUseCasee) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10

            const result = await this.getAllPsychologistUseCase.execute({
                search: req.query.search as string,
                sort: req.query.sort as 'asc' | 'desc',
                gender: req.query.gender as 'Male' | 'Female' | 'all',
                expertise: req.query.expertise as string,
                page,
                limit
            })
            const response = {
                psychologists: result.psychologists,
                totalCount: result.totalCount
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