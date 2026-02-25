import type { Database } from "./database";

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type Interview = Database["public"]["Tables"]["interviews"]["Row"];
export type InterviewInsert = Database["public"]["Tables"]["interviews"]["Insert"];
export type ModerationFlag = Database["public"]["Tables"]["moderation_flags"]["Row"];
export type InterviewVote = Database["public"]["Tables"]["interview_votes"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type CompanyScore = Database["public"]["Views"]["company_scores"]["Row"];

export type InterviewOutcome = Database["public"]["Enums"]["interview_outcome"];
export type InterviewType = Database["public"]["Enums"]["interview_type"];
export type SeniorityLevel = Database["public"]["Enums"]["seniority_level"];
export type ReviewStatus = Database["public"]["Enums"]["review_status"];

export type SearchResult = Database["public"]["Functions"]["search_companies"]["Returns"][number];
