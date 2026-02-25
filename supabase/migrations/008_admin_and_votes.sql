-- ============================================================
-- Migration 008: Admin Flag + Interview Votes
-- ============================================================

-- 1. Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false NOT NULL;

-- 2. Admin RLS policies for interviews
-- Admins can read ALL interviews (not just approved), including pending/rejected
CREATE POLICY "Admins can read all interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can update interview status (approve/reject)
CREATE POLICY "Admins can update interview status"
  ON interviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- 3. Admin RLS for moderation_flags (admins can read all flags)
-- Note: authenticated users can already read flags from migration 006,
-- so this is already covered. No additional policy needed.

-- 4. Create interview_votes table
CREATE TABLE interview_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('helpful', 'unhelpful')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (interview_id, user_id)
);

CREATE INDEX idx_interview_votes_interview_id ON interview_votes (interview_id);
CREATE INDEX idx_interview_votes_user_id ON interview_votes (user_id);

-- 5. RLS for interview_votes
ALTER TABLE interview_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can see vote counts
CREATE POLICY "Votes are publicly readable"
  ON interview_votes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert their own votes
CREATE POLICY "Authenticated users can vote"
  ON interview_votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own votes (change vote type)
CREATE POLICY "Users can update own votes"
  ON interview_votes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own votes (un-vote)
CREATE POLICY "Users can delete own votes"
  ON interview_votes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
