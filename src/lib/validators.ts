import { z } from "zod";

const KNUST_EMAIL_REGEX = /@(st\.)?knust\.edu\.gh$/;

export const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .refine(
      (email) => KNUST_EMAIL_REGEX.test(email),
      "cyberSpace is currently only available to KNUST students. Join the waitlist."
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  college: z.enum(["COE", "COS", "KSB", "COHS", "COA", "COAS", "IDL", "OTHER"]),
  program: z.string().optional(),
  yearOfStudy: z.coerce.number().min(1).max(7).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const rsvpSchema = z.object({
  eventId: z.string().min(1),
  status: z.enum(["INTERESTED", "GOING", "ATTENDED", "MISSED"]),
});

export const commentSchema = z.object({
  eventId: z.string().min(1),
  content: z
    .string()
    .min(3, "Comment must be at least 3 characters")
    .max(1000, "Comment must be under 1000 characters"),
  tipType: z
    .enum(["BEST_PART", "SKIP_THIS", "BRING_THIS", "TALK_TO", "GENERAL"])
    .optional(),
});

export const linkedinPostSchema = z.object({
  eventId: z.string().min(1),
  takeaways: z
    .string()
    .min(10, "Tell us a bit more about your takeaways")
    .max(2000),
});

export const preEventBriefSchema = z.object({
  eventId: z.string().min(1),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(500).optional(),
  program: z.string().max(100).optional(),
  yearOfStudy: z.coerce.number().min(1).max(7).optional(),
  interests: z.array(z.string()).max(10).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  college: z
    .enum(["COE", "COS", "KSB", "COHS", "COA", "COAS", "IDL", "OTHER"])
    .optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type LinkedInPostInput = z.infer<typeof linkedinPostSchema>;
export type PreEventBriefInput = z.infer<typeof preEventBriefSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
