import { Request, Response, NextFunction } from "express";

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export const validateImageUpload = (req: Request, res: Response, next: NextFunction) => {
    const file = req.file
    if(!file) {
        return res.status(400).json({message: "Image is required"})
    }

    if(!ALLOWED_TYPES.includes(file.mimetype)) {
        return res.status(400).json({message: "Only JPEG, PNG, and WEBP formats are allowed"})
    }

    if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ message: "Image must be smaller than 5MB" })
    }

    next()
}