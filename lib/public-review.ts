import { z } from "zod"

// FormData values must be strings; do not accept parseInt's partial numbers.
const integer = z.string().regex(/^[1-9]\d*$/).transform(Number).pipe(z.number().int().positive().max(2147483647))
export const publicReviewSchema = z.object({
  agency_id: integer,
  reviewer_name: z.string().trim().min(1).max(255),
  reviewer_email: z.string().trim().email().max(255),
  rating: integer.pipe(z.number().min(1).max(5)),
  comment: z.string().trim().min(1).max(5000),
})
