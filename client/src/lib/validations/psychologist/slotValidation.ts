import { z } from 'zod';

export const slotSchema = z
  .object({
    isRecurring: z.boolean(),
    startDateTime: z.string().optional(),
    endDateTime: z.string().optional(),

    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    weekDays: z.array(z.string()).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    duration: z.number().min(1).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      if (!data.fromDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fromDate'],
          message: 'from date is required for recurring slots',
        });
      }
      if (!data.toDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['toDate'],
          message: 'to date is required for recurring slots',
        });
      }
      if (!data.weekDays || data.weekDays.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['weekDays'],
          message: 'At least one weekday must be selected',
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

      // Validate fromDate < toDate
      if (data.fromDate && data.toDate) {
        const from = new Date(data.fromDate);
        const to = new Date(data.toDate);
        if (from > to) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['fromDate'],
            message: 'fromDate cannot be after toDate',
          });
        }
      }

      // Validate startTime < endTime
      if (data.startTime && data.endTime) {
        const [sh, sm] = data.startTime.split(':').map(Number);
        const [eh, em] = data.endTime.split(':').map(Number);
        if (sh > eh || (sh === eh && sm >= em)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['startTime'],
            message: 'startTime must be before endTime',
          });
        }
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

      // Validate startDateTime < endDateTime
      if (data.startDateTime && data.endDateTime) {
        const start = new Date(data.startDateTime);
        const end = new Date(data.endDateTime);
        if (start > end) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['startDateTime'],
            message: 'startDateTime cannot be after endDateTime',
          });
        }
      }
    }
  });

export type slotData = z.infer<typeof slotSchema>;
