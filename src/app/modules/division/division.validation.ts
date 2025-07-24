import { z } from "zod";

export const createDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division Name must be string" })
    .min(2, { message: "Division Name must be 2 characters long!" }),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

export const updateDivisionZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Division Name must be string" })
    .min(2, { message: "Division Name must be 2 characters long!" })
    .optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
