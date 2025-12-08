import parsePhoneNumberFromString from 'libphonenumber-js';
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

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[A-Za-z ]+$/, { message: 'Name can only contain letters and spaces' })
    .min(2, { message: 'name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters' }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(100, { message: 'Email is too long' }),
  phone: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, {
      message: 'Enter a valid international phone number',
    })
    .refine(
      value => {
        const phone = parsePhoneNumberFromString(value);
        console.log('phone:', phone, 'valid: ', phone?.isValid());
        return phone?.isValid() === true;
      },
      {
        message: 'Phone number is not valid',
      }
    )
    .refine(value => !/^(\d)\1+$/.test(value.replace(/\D/g, '')), {
      message: 'Phone number cannot be all repeated digits',
    }),
  dateOfBirth: z
    .string()
    .transform(val => val === '' ? undefined : val)
    .optional()
    .refine((date) => {
      if (!date) return true;  // allow empty
      const dob = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      return age >= 18 && age < 100;
    }, 'You must be at least 18 years old and less than 100 years old'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  profileImage: imageFileSchema.optional(),
});

export type updateProfileData = z.infer<typeof updateProfileSchema>