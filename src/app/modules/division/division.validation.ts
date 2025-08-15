import z from "zod";



export const createDivisionZodScheme = z.object({
     name: z
    .string()
    .min(2, { message: "Name is required" })
    .max(100, { message: "Name must be 100 characters or less" }),

  slug: z
    .string()
    .min(2, { message: "Slug is required" })
    .max(100, { message: "Slug must be 100 characters or less" })
    .optional(),
    
   thumbnail: z
    .string()
    .url({ message: "Thumbnail must be a valid URL" })
    .optional(),

  description: z
    .string()
    .max(1000, { message: "Description must be 1000 characters or less" })
    .optional(),
})


export const updateDivisionZodSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  slug: z.string().min(2, { message: "slug is required" }).optional(),
  thumbnail: z.string().url().optional(),
  description: z.string().optional(),
});

