import { z } from "zod";

export const createTourZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "title must be string." })
    .max(100, { message: "title cannot exceed 200 characters" }),
  description: z
    .string({ invalid_type_error: "description must be string." })
    .optional(),
  location: z
    .string({ invalid_type_error: "location must be string." })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "costFrom must be number." })
    .optional(),
  startDate: z
    .string({ invalid_type_error: "startDate must be string." })
    .optional()
    .optional(),
  endDate: z
    .string({ invalid_type_error: "endDate must be string." })
    .optional()
    .optional(),
  tourType: z.string(), // <- changed here
  included: z
    .array(z.string({ invalid_type_error: "included must be string." }))
    .optional(),
  excluded: z
    .array(z.string({ invalid_type_error: "excluded must be string." }))
    .optional(),
  amenities: z
    .array(z.string({ invalid_type_error: "amenities must be string." }))
    .optional(),
  tourPlan: z
    .array(z.string({ invalid_type_error: "tourPlan must be string." }))
    .optional(),
  maxGuest: z
    .number({ invalid_type_error: "maxGuest must be number." })
    .optional(),
  minAge: z.number({ invalid_type_error: "minAge must be number." }).optional(),
  division: z.string({ invalid_type_error: "division must be string." }),
  departureLocation: z
    .string({ invalid_type_error: "departureLocation must be string." })
    .optional(),
  arrivalLocation: z
    .string({ invalid_type_error: "arrivalLocation must be string." })
    .optional(),
});

export const updateTourZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "title must be string." })
    .max(100, { message: "title cannot exceed 200 characters" })
    .optional(),
  description: z
    .string({ invalid_type_error: "description must be string." })
    .optional(),
  location: z
    .string({ invalid_type_error: "location must be string." })
    .optional(),
  costFrom: z
    .number({ invalid_type_error: "costFrom must be number." })
    .optional(),
  startDate: z
    .string({ invalid_type_error: "startDate must be string." })
    .optional(),
  endDate: z
    .string({ invalid_type_error: "endDate must be string." })
    .optional(),
  tourType: z.string().optional(), // <- changed here
  included: z
    .array(z.string({ invalid_type_error: "included must be string." }))
    .optional(),
  excluded: z
    .array(z.string({ invalid_type_error: "excluded must be string." }))
    .optional(),
  amenities: z
    .array(z.string({ invalid_type_error: "amenities must be string." }))
    .optional(),
  tourPlan: z
    .array(z.string({ invalid_type_error: "tourPlan must be string." }))
    .optional(),
  maxGuest: z
    .number({ invalid_type_error: "maxGuest must be number." })
    .optional(),
  minAge: z.number({ invalid_type_error: "minAge must be number." }).optional(),
  division: z
    .string({ invalid_type_error: "division must be string." })
    .optional(),
  departureLocation: z
    .string({ invalid_type_error: "departureLocation must be string." })
    .optional(),
  arrivalLocation: z
    .string({ invalid_type_error: "arrivalLocation must be string." })
    .optional(),
  deleteImages: z.array(z.string()).optional(),
});

export const createTourTypeZodSchema = z.object({
  name: z.string({ invalid_type_error: "Tour Type must be string" }),
});
