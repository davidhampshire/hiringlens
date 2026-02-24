-- ============================================================================
-- HiringLens - All Database Migrations
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================================

-- ============================================================================
-- Migration 001: Create Companies Table
-- ============================================================================

-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  industry TEXT,
  location TEXT,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_companies_slug ON companies (slug);
CREATE INDEX idx_companies_industry ON companies (industry);

-- Full-text search
ALTER TABLE companies ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(industry, '') || ' ' || coalesce(location, ''))) STORED;

CREATE INDEX idx_companies_fts ON companies USING GIN (fts);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- Migration 002: Create Interviews Table
-- ============================================================================

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

-- ============================================================================
-- Migration 003: Create Moderation Flags Table
-- ============================================================================

-- Moderation flags table
CREATE TABLE moderation_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  reporter_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_moderation_flags_interview_id ON moderation_flags (interview_id);

-- ============================================================================
-- Migration 004: Create Company Scores View
-- ============================================================================

-- Reality Score computation function
CREATE OR REPLACE FUNCTION compute_reality_score(
  avg_prof NUMERIC,
  avg_comm NUMERIC,
  avg_clarity NUMERIC,
  avg_fairness NUMERIC,
  pct_ghosted NUMERIC,
  pct_unpaid NUMERIC,
  pct_exceeded NUMERIC,
  pct_no_feedback NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  base_score NUMERIC;
  penalty NUMERIC;
BEGIN
  base_score := (COALESCE(avg_prof, 0) + COALESCE(avg_comm, 0) + COALESCE(avg_clarity, 0) + COALESCE(avg_fairness, 0)) / 4.0 * 20.0;
  penalty := (COALESCE(pct_ghosted, 0) * 15.0)
           + (COALESCE(pct_unpaid, 0) * 10.0)
           + (COALESCE(pct_exceeded, 0) * 10.0)
           + (COALESCE(pct_no_feedback, 0) * 5.0);
  RETURN GREATEST(0, ROUND(base_score - penalty, 1));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Aggregated company scores view
CREATE OR REPLACE VIEW company_scores AS
SELECT
  c.id AS company_id,
  c.name,
  c.slug,
  c.industry,
  c.location,
  c.logo_url,
  COUNT(i.id)::INTEGER AS total_reviews,
  ROUND(AVG(i.professionalism_rating)::NUMERIC, 1) AS avg_professionalism,
  ROUND(AVG(i.communication_rating)::NUMERIC, 1) AS avg_communication,
  ROUND(AVG(i.clarity_rating)::NUMERIC, 1) AS avg_clarity,
  ROUND(AVG(i.fairness_rating)::NUMERIC, 1) AS avg_fairness,
  ROUND(AVG(CASE WHEN i.ghosted THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_ghosted,
  ROUND(AVG(CASE WHEN i.unpaid_task THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_unpaid_task,
  ROUND(AVG(CASE WHEN i.exceeded_timeline THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_exceeded_timeline,
  ROUND(AVG(CASE WHEN NOT i.received_feedback THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_no_feedback,
  ROUND(AVG(i.stages_count)::NUMERIC, 1) AS avg_stages,
  ROUND(AVG(i.total_duration_days)::NUMERIC, 0) AS avg_duration_days,
  compute_reality_score(
    AVG(i.professionalism_rating),
    AVG(i.communication_rating),
    AVG(i.clarity_rating),
    AVG(i.fairness_rating),
    AVG(CASE WHEN i.ghosted THEN 1.0 ELSE 0.0 END),
    AVG(CASE WHEN i.unpaid_task THEN 1.0 ELSE 0.0 END),
    AVG(CASE WHEN i.exceeded_timeline THEN 1.0 ELSE 0.0 END),
    AVG(CASE WHEN NOT i.received_feedback THEN 1.0 ELSE 0.0 END)
  ) AS reality_score
FROM companies c
LEFT JOIN interviews i ON i.company_id = c.id AND i.status = 'approved'
GROUP BY c.id, c.name, c.slug, c.industry, c.location, c.logo_url;

-- ============================================================================
-- Migration 005: Create Search Function
-- ============================================================================

-- Full-text search RPC function
CREATE OR REPLACE FUNCTION search_companies(search_query TEXT, result_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  industry TEXT,
  location TEXT,
  logo_url TEXT,
  total_reviews BIGINT,
  reality_score NUMERIC,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.industry,
    c.location,
    c.logo_url,
    COALESCE(cs.total_reviews::BIGINT, 0) AS total_reviews,
    COALESCE(cs.reality_score, 0) AS reality_score,
    ts_rank(c.fts, plainto_tsquery('english', search_query)) AS rank
  FROM companies c
  LEFT JOIN company_scores cs ON cs.company_id = c.id
  WHERE c.fts @@ plainto_tsquery('english', search_query)
     OR c.name ILIKE '%' || search_query || '%'
  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Migration 006: Create RLS Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_flags ENABLE ROW LEVEL SECURITY;

-- Companies: anyone can read
CREATE POLICY "Companies are publicly readable"
  ON companies FOR SELECT
  TO anon, authenticated
  USING (true);

-- Companies: anyone can insert (for auto-creation on form submit)
CREATE POLICY "Anyone can create companies"
  ON companies FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Interviews: anyone can read approved interviews
CREATE POLICY "Approved interviews are publicly readable"
  ON interviews FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- Interviews: anyone can submit (status forced to pending)
CREATE POLICY "Anyone can submit an interview experience"
  ON interviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Moderation flags: anyone can create a flag
CREATE POLICY "Anyone can flag content"
  ON moderation_flags FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Moderation flags: only authenticated users can read
CREATE POLICY "Only authenticated users can read flags"
  ON moderation_flags FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- All migrations complete!
-- ============================================================================
