-- Enums
CREATE TYPE interview_outcome AS ENUM ('offer', 'rejected', 'ghosted', 'withdrew', 'pending');
CREATE TYPE interview_type AS ENUM ('onsite', 'remote', 'hybrid', 'phone_screen', 'take_home', 'mixed');
CREATE TYPE seniority_level AS ENUM ('intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'director', 'vp', 'c_level');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');

-- Interviews table
CREATE TABLE interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role_title TEXT NOT NULL,
  seniority seniority_level,
  location TEXT,
  interview_type interview_type,
  stages_count INTEGER CHECK (stages_count > 0 AND stages_count <= 20),
  total_duration_days INTEGER CHECK (total_duration_days > 0),
  outcome interview_outcome,
  received_feedback BOOLEAN DEFAULT false,
  unpaid_task BOOLEAN DEFAULT false,
  ghosted BOOLEAN DEFAULT false,
  interviewer_late BOOLEAN DEFAULT false,
  exceeded_timeline BOOLEAN DEFAULT false,
  professionalism_rating INTEGER NOT NULL CHECK (professionalism_rating BETWEEN 1 AND 5),
  communication_rating INTEGER NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
  clarity_rating INTEGER NOT NULL CHECK (clarity_rating BETWEEN 1 AND 5),
  fairness_rating INTEGER NOT NULL CHECK (fairness_rating BETWEEN 1 AND 5),
  overall_comments TEXT,
  candidate_tip TEXT,
  status review_status DEFAULT 'pending' NOT NULL,
  submitted_by UUID,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_interviews_company_id ON interviews (company_id);
CREATE INDEX idx_interviews_status ON interviews (status);
CREATE INDEX idx_interviews_company_status ON interviews (company_id, status);
CREATE INDEX idx_interviews_created_at ON interviews (created_at DESC);
