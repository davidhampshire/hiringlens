-- ============================================================
-- Company Representatives & Responses
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. company_representatives table
CREATE TABLE IF NOT EXISTS company_representatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'responder' CHECK (role IN ('admin', 'responder')),
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- 2. company_responses table
CREATE TABLE IF NOT EXISTS company_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  representative_id uuid NOT NULL REFERENCES company_representatives(id) ON DELETE CASCADE,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(interview_id) -- one company response per review
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_company_reps_user_id ON company_representatives(user_id);
CREATE INDEX IF NOT EXISTS idx_company_reps_company_id ON company_representatives(company_id);
CREATE INDEX IF NOT EXISTS idx_company_responses_interview_id ON company_responses(interview_id);
CREATE INDEX IF NOT EXISTS idx_company_responses_representative_id ON company_responses(representative_id);
CREATE INDEX IF NOT EXISTS idx_company_responses_status ON company_responses(status);

-- 4. Enable RLS
ALTER TABLE company_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: company_representatives
-- ============================================================

-- Reps can read their own records
CREATE POLICY "Reps can read own records"
  ON company_representatives FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all reps
CREATE POLICY "Admins can read all reps"
  ON company_representatives FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can insert reps
CREATE POLICY "Admins can insert reps"
  ON company_representatives FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can update reps
CREATE POLICY "Admins can update reps"
  ON company_representatives FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can delete reps
CREATE POLICY "Admins can delete reps"
  ON company_representatives FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================
-- RLS Policies: company_responses
-- ============================================================

-- Anyone can read published responses (for public display)
CREATE POLICY "Anyone can read published responses"
  ON company_responses FOR SELECT
  USING (status = 'published');

-- Reps can read their own responses (any status)
CREATE POLICY "Reps can read own responses"
  ON company_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM company_representatives
      WHERE id = representative_id AND user_id = auth.uid()
    )
  );

-- Admins can read all responses
CREATE POLICY "Admins can read all responses"
  ON company_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Verified reps can insert responses for their company's approved reviews
CREATE POLICY "Verified reps can insert responses"
  ON company_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM company_representatives cr
      JOIN interviews i ON i.company_id = cr.company_id
      WHERE cr.id = representative_id
        AND cr.user_id = auth.uid()
        AND cr.verified_at IS NOT NULL
        AND i.id = interview_id
        AND i.status = 'approved'
    )
  );

-- Reps can update their own pending responses
CREATE POLICY "Reps can update own pending responses"
  ON company_responses FOR UPDATE
  USING (
    status = 'pending'
    AND EXISTS (
      SELECT 1 FROM company_representatives
      WHERE id = representative_id AND user_id = auth.uid()
    )
  );

-- Admins can update any response (for moderation)
CREATE POLICY "Admins can update any response"
  ON company_responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins can delete responses
CREATE POLICY "Admins can delete responses"
  ON company_responses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================================
-- Updated_at trigger for company_responses
-- ============================================================
CREATE OR REPLACE FUNCTION update_company_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_company_responses_updated_at
  BEFORE UPDATE ON company_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_company_responses_updated_at();
