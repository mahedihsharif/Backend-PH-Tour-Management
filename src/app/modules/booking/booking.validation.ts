import { z } from "zod";
import { BOOKING_STATUS } from "./booking.interface";

export const createBookingZodSchema = z.object({
  tour: z.string(),
  guestCount: z
    .number({ invalid_type_error: "Guest Count must be number" })
    .int({ message: "Guest Count must be integer number" })
    .positive({ message: "Guest Cont must be positive number" }),
});

export const updateBookingStatusZodSchema = z.object({
  status: z.enum(Object.values(BOOKING_STATUS) as [string]),
});
