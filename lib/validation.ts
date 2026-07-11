import { z } from "zod";

export const counsellingSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  interestedIn: z.string().min(1, "Select a course you're interested in"),
  message: z.string().max(500).optional(),
  source: z.string().optional(),
});

export type CounsellingFormValues = z.infer<typeof counsellingSchema>;
