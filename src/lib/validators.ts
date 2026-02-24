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
  overall_comments: z.string().max(2000).optional(),
  candidate_tip: z.string().max(1000).optional(),
});

export type InterviewFormData = z.input<typeof interviewSchema>;

export const flagSchema = z.object({
  interview_id: z.string().uuid(),
  reason: z.string().min(1, "Please select a reason"),
});

export type FlagFormData = z.infer<typeof flagSchema>;
