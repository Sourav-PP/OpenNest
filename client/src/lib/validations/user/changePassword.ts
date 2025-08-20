import {z} from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(30, { message: 'Password must be at most 30 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(30, { message: 'Password must be at most 30 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string().trim().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export type changePasswordData= z.infer<typeof changePasswordSchema>