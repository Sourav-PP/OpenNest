import { Request, Response } from "express";

export class LogoutUseCase {
    async execute(req: Request, res: Response): Promise<void> {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
    }
}