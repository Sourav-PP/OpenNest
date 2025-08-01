import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

const imageFileSchema = z
    .custom<FileList>()
    .refine((filelist) => filelist?.length > 0, {
        message: "Image is required"
    })
    .refine((filelist) => filelist?.[0]?.size <= MAX_IMAGE_SIZE, {
        message: "Image size should be less than 5MB"
    }) 
    .refine((filelist) => ACCEPTED_MIME_TYPES.includes(filelist?.[0]?.type),{
        message: "Only JPEG, PNG, or WEPG images are allowed"
})

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "name must be at least 2 characters long" }),
  email: z.string().email(),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  profileImage: imageFileSchema,
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().trim().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})

export type SignupData = z.infer<typeof signupSchema>;