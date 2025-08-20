import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const fileSchema = z
  .custom<FileList>()
  .refine((fileList) => fileList?.length > 0, {
    message: 'File is required',
  })
  .refine((fileList) => fileList?.[0]?.size <= MAX_FILE_SIZE, {
    message: 'File must be smaller than 5MB',
  })
  .refine((fileList) => ACCEPTED_MIME_TYPES.includes(fileList?.[0]?.type), {
    message: 'Only PDF, JPEG, or PNG files are allowed',
  });


export const verificationSchema = z.object({
  qualification: z
    .string()
    .trim()
    .min(1, { message: 'Qualification is required'}),
  specializations: z
    .array(z.string())
    .min(1, { message: 'At least one specialization must be selected' }),
  aboutMe: z
    .string()
    .trim()
    .min(1, { message: 'aboutMe is required' })
    .max(300, { message: 'aboutMe must be at most 300 characters' }),
  defaultFee: z
    .number({
      required_error: 'Default Fee is required',            
      invalid_type_error: 'Default Fee must be a number',
    })
    .refine((val) => !isNaN(val) && val >= 0, {
      message: 'Default Fee must be a non-negative number',
    }),

  identificationDoc: fileSchema,
  educationalCertification: fileSchema,
  experienceCertificate: fileSchema,
});

export type verificationData = z.infer<typeof verificationSchema>