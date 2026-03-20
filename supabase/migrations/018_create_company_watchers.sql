-- Company watchers: users who want email alerts when a new review is posted
CREATE TABLE company_watchers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  unsubscribe_token uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(email, company_id)
);

-- RLS
ALTER TABLE company_watchers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (insert their own email)
CREATE POLICY "Anyone can subscribe to watch a company"
  ON company_watchers FOR INSERT
  WITH CHECK (true);

-- Only service role can read (used for sending notifications server-side)
-- No SELECT policy for public = effectively service-role only
