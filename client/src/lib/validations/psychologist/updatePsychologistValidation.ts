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

export const updatePsychologistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be at most 50 characters' })
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, dot, apostrophe, or hyphen'),
  email: z.string().trim().email('Invalid email address'),
  phone: z
    .string()
    .regex(/^[6-9][0-9]{9}$/, 'Invalid mobile number (must be 10 digits starting with 6-9)'),
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
  defaultFee: z
    .number({
      required_error: 'Default Fee is required',            
      invalid_type_error: 'Default Fee must be a number',
    })
    .min(0, { message: 'Default Fee must be non-negative' })
    .max(10000, { message: 'Default Fee cannot exceed 10,000' }),
  aboutMe: z
    .string()
    .trim()
    .min(10, { message: 'About Me must be at least 10 characters' })
    .max(300, { message: 'About Me must be at most 300 characters' })
    .refine((val) => val.split(/\s/).some((w) => w.length > 0), { message: 'About Me cannot be empty' }),
});

export type updatePsychologistData = z.infer<typeof updatePsychologistSchema>