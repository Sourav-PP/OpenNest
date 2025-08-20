import { z } from 'zod';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const imageFileSchema = z
  .custom<FileList>()
  .refine((filelist) => !filelist || filelist.length === 0 || filelist[0].size <= MAX_IMAGE_SIZE, {
    message: 'Image size should be less than 5MB'
  }) 
  .refine((filelist) => !filelist || filelist.length === 0 || ACCEPTED_MIME_TYPES.includes(filelist[0]?.type),{
    message: 'Only JPEG, PNG, or WEPG images are allowed'
  });

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s'.-]+$/, {
      message: 'Name can only contain letters, spaces, apostrophes, and hyphens',
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(100, { message: 'Email is too long' }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, {
      message: 'Invalid mobile number (must be 10 digits and start with 6-9)',
    }),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Date of birth must be in YYYY-MM-DD format',
    })
    .refine((date) => {
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 18 && age < 100;
    }, 'You must be at least 18 years old and less than 100 years old')
    .optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  profileImage: imageFileSchema.optional(),
});

export type updateProfileData = z.infer<typeof updateProfileSchema>