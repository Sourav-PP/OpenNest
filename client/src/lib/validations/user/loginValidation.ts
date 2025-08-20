import {z} from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(100, { message: 'Email must be at most 100 characters long' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(30, { message: 'Password must be at most 30 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
});

export type LoginData= z.infer<typeof loginSchema>