-- Allow users to delete their own pending interviews
CREATE POLICY "Users can delete own pending interviews"
  ON interviews
  FOR DELETE
  USING (
    auth.uid() = submitted_by
    AND status = 'pending'
  );
