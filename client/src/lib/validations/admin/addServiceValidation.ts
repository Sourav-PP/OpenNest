import { z } from 'zod'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]

const imageFileSchema = z
    .custom<FileList>()
    .refine((filelist) => filelist?.length > 0, {
        message: "Image is required"
    })
    .refine((filelist) => filelist?.[0]?.size <= MAX_IMAGE_SIZE, {
        message: "Image size should be less than 5MB"
    }) 
    .refine((filelist) => ACCEPTED_MIME_TYPES.includes(filelist?.[0]?.type),{
        message: "Only JPEG, PNG, or WEPG images are allowed"
    })

export const addServiceSchema = z.object({
    name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" }),
    description: z
    .string()
    .trim()
    .min(1, {message: "description is required"})
    .max(1000, {message: 'description can be atmost maximum characters'}),
    bannerImage: imageFileSchema
})

export type addServiceData = z.infer<typeof addServiceSchema>