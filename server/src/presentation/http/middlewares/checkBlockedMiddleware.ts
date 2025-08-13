import { Request, Response, NextFunction, RequestHandler } from "express";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

export const checkBlockedMiddleware = (userRepository: IUserRepository): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return 
    }

    try {
      const isBlocked = await userRepository.isUserBlocked(req.user.userId);
      if (isBlocked) {
        res.status(403).json({ message: "Your account has been blocked by the administrator." });
        return 
      }
      next();
    } catch (error) {
      console.error("Error checking block status", error);
      res.status(500).json({ message: "Internal server error" });
      return 
    }
};
