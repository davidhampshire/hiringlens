-- ============================================================
-- Migration 009: Contact Messages
-- ============================================================

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_contact_messages_created_at ON contact_messages (created_at DESC);

-- RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read contact messages
CREATE POLICY "Admins can read contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
