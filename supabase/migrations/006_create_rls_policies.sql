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
