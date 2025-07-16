import { Request, Response, NextFunction, RequestHandler } from "express";
import { TokenService } from "../../../domain/interfaces/tokenService";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string
                email: string
                role: "user" | "psychologist" | "admin"
            }
        }
    }
}

export const authMiddleware =
  (jwtService: TokenService, allowedRoles: Array<"user" | "psychologist" | "admin">): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log('authheader: ', authHeader)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return 
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwtService.verifyAccessToken(token);

      console.log("payload ",payload)
      if (!payload || !payload.userId || !payload.email || !payload.role) {
        res.status(401).json({ message: "Invalid token structure" });
        return 
      }

      const userRole = payload.role as "user" | "psychologist" | "admin";

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({ message: "Access denied for this role" });
        return 
      }

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: userRole,
      };

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
      return 
    }
  };
