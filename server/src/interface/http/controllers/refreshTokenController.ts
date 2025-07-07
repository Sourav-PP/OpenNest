import { Request, Response } from "express";
import { RefreshTokenUseCase } from "../../../useCases/refreshToken/refreshTokenUseCase";
import { AppError } from "../../../domain/errors/AppError";

export class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  handle = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ message: "No refresh token" });
        return;
      }

      const accessToken = await this.refreshTokenUseCase.execute(refreshToken);
      res.status(200).json({ accessToken });
      return;
    } catch (error: any) {
      const status = error instanceof AppError ? error.statusCode : 500;
      const message = error.message || "Internal server error";
      res.status(status).json({ message });
    }
  };
}
