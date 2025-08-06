import { Request, Response } from "express";
import { GetSlotByPsychologistUseCase } from "../../../../useCases/implementation/psychologist/availability/GetSlotByPsychologistUseCase";
import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";
import { AppError } from "../../../../domain/errors/AppError";

export class GetSlotByPsychologistController {
    constructor(
        private getSlotByPsychologistUseCase: GetSlotByPsychologistUseCase,
        private psychologistRepo: IPsychologistRepository
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            if(!userId) {
            res.status(401).json({ message: 'Unauthorized' })
            return 
            }

            const psychologist = await this.psychologistRepo.findByUserId(userId)
            if(!psychologist?.id) {
                res.status(404).json({message: "Psychologist not found"})
                return 
            }

            const slots = await this.getSlotByPsychologistUseCase.execute(psychologist.id)
            res.json(slots)
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}