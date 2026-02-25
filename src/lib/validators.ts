import { z } from "zod";

export const interviewSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  company_id: z.string().uuid().optional(),
  industry: z.string().optional(),
  role_title: z.string().min(1, "Role title is required"),
  seniority: z
    .enum(["intern", "junior", "mid", "senior", "staff", "principal", "director", "vp", "c_level"])
    .optional(),
  location: z.string().optional(),
  interview_type: z
    .enum(["onsite", "remote", "hybrid", "phone_screen", "take_home", "mixed"])
    .optional(),
  stages_count: z.coerce.number().int().min(1).max(20).optional(),
  total_duration_days: z.coerce.number().int().min(1).optional(),
  outcome: z.enum(["offer", "rejected", "ghosted", "withdrew", "pending"]).optional(),
  received_feedback: z.boolean().default(false),
  unpaid_task: z.boolean().default(false),
  ghosted: z.boolean().default(false),
  interviewer_late: z.boolean().default(false),
  exceeded_timeline: z.boolean().default(false),
  professionalism_rating: z.number().int().min(1, "Rating required").max(5),
  communication_rating: z.number().int().min(1, "Rating required").max(5),
  clarity_rating: z.number().int().min(1, "Rating required").max(5),
  fairness_rating: z.number().int().min(1, "Rating required").max(5),
  salary_range: z.string().optional(),
  display_name: z.string().max(50).optional(),
  overall_comments: z.string().max(2000).optional(),
  candidate_tip: z.string().max(1000).optional(),
});

export type InterviewFormData = z.input<typeof interviewSchema>;

export const flagSchema = z.object({
  interview_id: z.string().uuid(),
  reason: z.string().min(1, "Please select a reason"),
});

export type FlagFormData = z.infer<typeof flagSchema>;

/* ── Auth Schemas ── */

export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/* ── Contact Schema ── */

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;
