import { Request, Response } from "express";
import { AdminLoginUseCase } from "../../../../useCases/admin/login/loginUseCase";
import { AppError } from "../../../../domain/errors/AppError";

export class AdminAuthController {
    constructor(private adminLoginUseCase: AdminLoginUseCase) {}

    handle = async(req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body
            const {accessToken, refreshToken} = await this.adminLoginUseCase.execute({email, password})

            res.cookie("adminRefreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            res.status(200).json({accessToken})
        } catch (error: any) {
            const status = error instanceof AppError ? error.statusCode : 500
            const message = error.message || "Internal server error";
            console.log("its here", message, status)
            res.status(status).json({ message });
        }
    }
}