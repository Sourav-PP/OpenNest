import { z } from 'zod';

export const addPlanSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name is required')
    .max(100, { message: 'Name cannot exceed 100 characters' }),
  description: z
    .string()
    .trim()
    .min(5, 'Description is required')
    .max(1000, { message: 'Description cannot exceed 1000 characters' }),
  price: z.string().min(1, 'Price is required'),
  creditsPerPeriod: z.string().min(1, 'Credits required'),
  billingPeriod: z.enum(['month', 'year', 'week']),
});

export type addPlanData = z.infer<typeof addPlanSchema>;
