import { Request, Response } from "express";

export class AdminLogoutUseCase {
    async execute(req: Request, res: Response): Promise<void> {
        res.clearCookie("adminRefreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    }
}