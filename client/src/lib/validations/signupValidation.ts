import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "name must be at least 2 characters long" }),
  email: z.string().email(),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
  confirmPassword: z.string().trim().min(6),
  otp: z.string().trim().length(6 ,{ message: "OTP must be at least 6 characters long" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})

export type SignupData = z.infer<typeof signupSchema>;