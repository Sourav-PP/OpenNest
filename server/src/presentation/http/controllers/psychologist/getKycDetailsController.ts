import { Request, Response } from "express";
import { IGetKycDetailsUseCase } from "../../../../useCases/interfaces/psychologist/profile/IGetKycDetailsUseCase";
import { IPsychologistRepository } from "../../../../domain/interfaces/IPsychologistRepository";
import { AppError } from "../../../../domain/errors/AppError";

export class GetKycDetailsController {
    constructor(
        private getKycDetailsUseCase: IGetKycDetailsUseCase,
        private psychologistRepo: IPsychologistRepository
    ) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId
            if(!userId) {
                res.status(401).json({success: false, message: "Unauthorized user"})
                return
            }

            const psychologist = await this.psychologistRepo.findByUserId(userId)

            if(!psychologist || !psychologist.id) {
                res.status(404).json({success: false, message: "Psychologist not found"})
                return
            }

            const kyc = await this.getKycDetailsUseCase.execute(psychologist.id)

            res.status(200).json(kyc)
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}