import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

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

export const signupSchema = z
  .object({
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
      .email({ message: 'Invalid email address' })
      .max(100, { message: 'Email must be at most 100 characters long' }),
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
    profileImage: imageFileSchema,
    password: z
      .string()
      .trim()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(30, { message: 'Password must be at most 30 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string().trim().min(6),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type SignupData = z.infer<typeof signupSchema>;
