export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          industry: string | null;
          location: string | null;
          logo_url: string | null;
          website_url: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          industry?: string | null;
          location?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          industry?: string | null;
          location?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      interviews: {
        Row: {
          id: string;
          company_id: string;
          role_title: string;
          seniority: Database["public"]["Enums"]["seniority_level"] | null;
          location: string | null;
          interview_type: Database["public"]["Enums"]["interview_type"] | null;
          stages_count: number | null;
          total_duration_days: number | null;
          outcome: Database["public"]["Enums"]["interview_outcome"] | null;
          received_feedback: boolean;
          unpaid_task: boolean;
          ghosted: boolean;
          interviewer_late: boolean;
          exceeded_timeline: boolean;
          professionalism_rating: number;
          communication_rating: number;
          clarity_rating: number;
          fairness_rating: number;
          salary_range: string | null;
          overall_comments: string | null;
          candidate_tip: string | null;
          status: Database["public"]["Enums"]["review_status"];
          submitted_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          role_title: string;
          seniority?: Database["public"]["Enums"]["seniority_level"] | null;
          location?: string | null;
          interview_type?: Database["public"]["Enums"]["interview_type"] | null;
          stages_count?: number | null;
          total_duration_days?: number | null;
          outcome?: Database["public"]["Enums"]["interview_outcome"] | null;
          received_feedback?: boolean;
          unpaid_task?: boolean;
          ghosted?: boolean;
          interviewer_late?: boolean;
          exceeded_timeline?: boolean;
          professionalism_rating: number;
          communication_rating: number;
          clarity_rating: number;
          fairness_rating: number;
          salary_range?: string | null;
          overall_comments?: string | null;
          candidate_tip?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          submitted_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          role_title?: string;
          seniority?: Database["public"]["Enums"]["seniority_level"] | null;
          location?: string | null;
          interview_type?: Database["public"]["Enums"]["interview_type"] | null;
          stages_count?: number | null;
          total_duration_days?: number | null;
          outcome?: Database["public"]["Enums"]["interview_outcome"] | null;
          received_feedback?: boolean;
          unpaid_task?: boolean;
          ghosted?: boolean;
          interviewer_late?: boolean;
          exceeded_timeline?: boolean;
          professionalism_rating?: number;
          communication_rating?: number;
          clarity_rating?: number;
          fairness_rating?: number;
          salary_range?: string | null;
          overall_comments?: string | null;
          candidate_tip?: string | null;
          status?: Database["public"]["Enums"]["review_status"];
          submitted_by?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      interview_votes: {
        Row: {
          id: string;
          interview_id: string;
          user_id: string;
          vote_type: "helpful" | "unhelpful";
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          user_id: string;
          vote_type: "helpful" | "unhelpful";
          created_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          user_id?: string;
          vote_type?: "helpful" | "unhelpful";
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          created_at?: string;
        };
      };
      moderation_flags: {
        Row: {
          id: string;
          interview_id: string;
          reason: string;
          reporter_ip: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          interview_id: string;
          reason: string;
          reporter_ip?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          interview_id?: string;
          reason?: string;
          reporter_ip?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      company_scores: {
        Row: {
          company_id: string;
          name: string;
          slug: string;
          industry: string | null;
          location: string | null;
          logo_url: string | null;
          total_reviews: number;
          avg_professionalism: number | null;
          avg_communication: number | null;
          avg_clarity: number | null;
          avg_fairness: number | null;
          pct_ghosted: number | null;
          pct_unpaid_task: number | null;
          pct_exceeded_timeline: number | null;
          pct_no_feedback: number | null;
          avg_stages: number | null;
          avg_duration_days: number | null;
          reality_score: number | null;
        };
      };
    };
    Functions: {
      search_companies: {
        Args: {
          search_query: string;
          result_limit?: number;
        };
        Returns: Array<{
          id: string;
          name: string;
          slug: string;
          industry: string | null;
          location: string | null;
          logo_url: string | null;
          total_reviews: number;
          reality_score: number;
          rank: number;
        }>;
      };
    };
    Enums: {
      interview_outcome: "offer" | "rejected" | "ghosted" | "withdrew" | "pending";
      interview_type: "onsite" | "remote" | "hybrid" | "phone_screen" | "take_home" | "mixed";
      seniority_level: "intern" | "junior" | "mid" | "senior" | "staff" | "principal" | "director" | "vp" | "c_level";
      review_status: "pending" | "approved" | "rejected";
    };
  };
};
