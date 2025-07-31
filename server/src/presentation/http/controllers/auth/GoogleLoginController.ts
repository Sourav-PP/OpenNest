import { Request, Response } from "express";
import { GoogleLoginUseCase } from "../../../../useCases/implementation/auth/googleLoginUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class GoogleLoginController {
    constructor (
        private googleLoginUseCase: GoogleLoginUseCase
    ) {}

    handle = async(req: Request, res: Response) => {
        try {
            const {credential, role} = req.body

            console.log("credential: ", credential)

            const result = await this.googleLoginUseCase.execute({credential, role})

            console.log("google login result: ", result)

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({
                success: true,
                message: "Login successfull",
                user: result.user,
                accessToken: result.accessToken,
                hasSubmittedVerificationForm: result.hasSubmittedVerificationForm
            });
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            res.status(status).json({ message });
        }
    }
}