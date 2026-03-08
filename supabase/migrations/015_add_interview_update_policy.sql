-- Allow authenticated users to update their own interviews
-- The WITH CHECK ensures the resulting status must be 'pending',
-- preventing users from self-approving edited content
CREATE POLICY "Users can update own interviews"
  ON interviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by)
  WITH CHECK (status = 'pending');
