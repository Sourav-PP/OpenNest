import { Request, Response, NextFunction, RequestHandler } from "express";
import { TokenService } from "../../../domain/interfaces/tokenService";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string
                email: string
                role: "user" | "psychologist"
            }
        }
    }
}

export const authMiddleware = (jwtService: TokenService): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization
        console.log('authHeader', authHeader)

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({message: "No token provided"})
            return 
        }

        const token = authHeader.split(' ')[1]

        try {
            const payload = jwtService.verifyAccessToken(token)

            if(!payload || !payload.userId || !payload.email || !payload.role) {
                res.status(401).json({message: "Invalid token structure"})
                return 
            }

            req.user = {
                userId: payload.userId,
                email: payload.email,
                role: payload.role as "user" | "psychologist"
            }

            next()
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token" });
            return 
        }
    }
}