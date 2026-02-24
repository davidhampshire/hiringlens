-- Moderation flags table
CREATE TABLE moderation_flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  reporter_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_moderation_flags_interview_id ON moderation_flags (interview_id);
