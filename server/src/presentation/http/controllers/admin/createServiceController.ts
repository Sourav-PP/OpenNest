import { Request, Response } from "express";
import { CreateServiceUseCase } from "../../../../useCases/admin/services/createServiceUseCase";
import { AppError } from "../../../../domain/errors/AppError";
import { uploadToCloudinary } from "../../../../utils/uploadToCloudinary";

export class CreateServiceController {
    constructor(private createServiceUseCase: CreateServiceUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const { name, description } = req.body
            const file = req.file

            if(!file) {
                res.status(400).json({message: "Banner image is required"})
                return
            }

            const clooudUrl = await uploadToCloudinary(file.buffer, file.originalname, "services")

            const service = await this.createServiceUseCase.execute({
                name,
                description,
                bannerImage: clooudUrl
            })

            res.status(201).json({message: "Service created", data: service})
            return
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            console.log("its here", message, status)
            res.status(status).json({ message });
        }
    }
}