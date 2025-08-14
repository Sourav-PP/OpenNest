import { z } from 'zod';

export const slotSchema = z.object({
  isRecurring: z.boolean(),
  startDateTime: z.string().optional(),
  endDateTime: z.string().optional(),

  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  weekDays: z.array(z.string()).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.number().min(1).nullable().optional(),
}).superRefine((data, ctx) => {
  if(data.isRecurring) {
    if(!data.fromDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fromDate'],
        message: 'from date is required for recurring slots'
      });
    }
    if(!data.toDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['toDate'],
        message: 'to date is required for recurring slots'
      });
    }
    if(!data.weekDays || data.weekDays.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['weekDays'],
        message: 'At least one weekday must be selected'
      });
    }
    if (!data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startTime'],
        message: 'startTime is required for recurring slots',
      });
    }
    if (!data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endTime'],
        message: 'endTime is required for recurring slots',
      });
    }
    if (data.duration === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: 'duration is required for recurring slots',
      });
    } 
  } else {
    if (!data.startDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDateTime'],
        message: 'startDateTime is required for single slot',
      });
    }
    if (!data.endDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDateTime'],
        message: 'endDateTime is required for single slot',
      });
    }
  }
});

export type slotData = z.infer<typeof slotSchema>