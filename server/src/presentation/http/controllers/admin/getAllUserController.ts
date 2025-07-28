import { Request, Response } from "express";
import { GetAllUserUseCase } from "../../../../useCases/implementation/admin/management/getAllUserUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class GetAllUserController {
    constructor(private getAllUserUseCasee: GetAllUserUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10

            const result = await this.getAllUserUseCasee.execute({
                search: req.query.search as string,
                sort: req.query.sort as "asc" | "desc",
                gender: req.query.gender as "Male" | "Female",
                page,
                limit
            })

            console.log("result in controller: ", result)
            res.status(200).json(result)
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}