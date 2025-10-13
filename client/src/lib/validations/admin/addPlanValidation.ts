import { z } from 'zod';

export const addPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name cannot exceed 100 characters' })
    .regex(/^[\w\s-]+$/, { message: 'Name contains invalid characters' }),

  description: z
    .string()
    .trim()
    .min(5, { message: 'Description must be at least 5 characters' })
    .max(1000, { message: 'Description cannot exceed 1000 characters' })
    .regex(/^[\w\s\-,.!?()]+$/, { message: 'Description contains invalid characters' }),

  price: z
    .number({ invalid_type_error: 'Price must be a number' })
    .positive({ message: 'Price must be greater than 0' })
    .max(10000, { message: 'Price cannot exceed 1,000,0' }),

  creditsPerPeriod: z
    .number({ invalid_type_error: 'Credits must be a number' })
    .int({ message: 'Credits must be an integer' })
    .positive({ message: 'Credits must be greater than 0' })
    .max(100, { message: 'Credits cannot exceed 10,0' }),

  billingPeriod: z.enum(['month', 'year', 'week'], {
    errorMap: () => ({ message: 'Billing period must be month, week, or year' }),
  }),
});


export type addPlanData = z.infer<typeof addPlanSchema>;
