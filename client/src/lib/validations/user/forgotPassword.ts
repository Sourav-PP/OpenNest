import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(100, { message: 'Email must be at most 100 characters long' }),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
