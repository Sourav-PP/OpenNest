import { Request, Response } from "express";
import { VerifyPsychologistUseCase } from "../../../useCases/psychologist/verifyPsychologist/verifyUseCase";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { AppError } from "../../../domain/errors/AppError";

export class VerifyPsychologistController {
    constructor(private verifyPsychologistUseCase: VerifyPsychologistUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            console.log("its in backend veriy controller")
            console.log("req :", req.body)
            console.log('files: ', req.files)
            const userId = req.user?.userId
            console.log("user id: ", userId)
            const files = req.files as Record<string, Express.Multer.File[]>

            const uploadDoc = async(field: string, label: string) => {
                const file = files[field]?.[0]

                if(!file) throw new Error(`${label} not uploaded`)
                return await uploadToCloudinary(file.buffer, `${label}-${Date.now()}`, 'kyc-docs')
            }

            const identificationUrl = await uploadDoc('identificationDoc', 'identification')
            const educationalCertificationUrl = await uploadDoc('educationalCertification', 'education')
            const experienceCertificateUrl = await uploadDoc('experienceCertificate', 'experience')

            const data = {
                ...req.body,
                userId,
                identificationDoc: identificationUrl,
                educationalCertification: educationalCertificationUrl,
                experienceCertificate: experienceCertificateUrl
            }

           const { psychologist, kyc} =  await this.verifyPsychologistUseCase.execute(data)

            res.status(201).json({
                success: true,
                message: "Verification profile submitted",
                data: {
                    psychologistId: psychologist._id,
                    isVerified: psychologist.isVerified,
                    kycStatus: kyc.kycStatus
                }
            })
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}