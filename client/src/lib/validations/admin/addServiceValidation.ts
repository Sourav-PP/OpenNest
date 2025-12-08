import { z } from 'zod';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const imageFileSchema = z
  .custom<FileList>()
  .refine(filelist => filelist?.length > 0, {
    message: 'Image is required',
  })
  .refine(filelist => filelist?.[0]?.size <= MAX_IMAGE_SIZE, {
    message: 'Image size should be less than 5MB',
  })
  .refine(filelist => ACCEPTED_MIME_TYPES.includes(filelist?.[0]?.type), {
    message: 'Invalid image type',
  })
  .refine(filelist => /\.(jpe?g|png|webp)$/i.test(filelist?.[0]?.name), {
    message: 'Invalid file extension',
  });

export const addServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[A-Za-z ]+$/, { message: 'Name can only contain letters and spaces' })
    .min(3, { message: 'name must be at least 3 characters long' })
    .max(50, { message: 'Name must be at most 50 characters' }),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(1000, { message: 'Description cannot exceed 1000 characters' }),
  bannerImage: imageFileSchema
});

export type addServiceData = z.infer<typeof addServiceSchema>