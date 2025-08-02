import { z } from 'zod'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

const imageFileSchema = z
    .custom<FileList>()
    .refine((filelist) => !filelist || filelist.length === 0 || filelist[0].size <= MAX_IMAGE_SIZE, {
        message: "Image size should be less than 5MB"
    }) 
    .refine((filelist) => !filelist || filelist.length === 0 || ACCEPTED_MIME_TYPES.includes(filelist[0]?.type),{
        message: "Only JPEG, PNG, or WEPG images are allowed"
    })

export const updatePsychologistSchema = z.object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[0-9]{10}$/, "Invalid mobile number (10 digits required)"),
    dateOfBirth: z.string().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    profileImage: imageFileSchema.optional(),
    defaultFee: z
    .number({
        required_error: "Default Fee is required",            
        invalid_type_error: "Default Fee must be a number",
    })
     .refine((val) => !isNaN(val) && val >= 0, {
    message: "Default Fee must be a non-negative number",
    }),
    aboutMe: z
    .string()
    .trim()
    .min(1, { message: "aboutMe is required" })
    .max(300, { message: "aboutMe must be at most 300 characters" }),
})

export type updatePsychologistData = z.infer<typeof updatePsychologistSchema>