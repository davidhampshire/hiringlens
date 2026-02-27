-- Add new optional fields to interviews table

-- Feature 1: How did you find the interview?
ALTER TABLE interviews ADD COLUMN application_source TEXT;

-- Feature 2: Would you recommend applying?
ALTER TABLE interviews ADD COLUMN recommend_applying TEXT
  CHECK (recommend_applying IN ('yes', 'maybe', 'no'));

-- Feature 3: Questions asked during the interview
ALTER TABLE interviews ADD COLUMN interview_questions TEXT;

-- Feature 4: When the interview took place (separate from created_at)
ALTER TABLE interviews ADD COLUMN interview_date DATE;

-- Feature 5: Department or team the role was within
ALTER TABLE interviews ADD COLUMN department TEXT;

-- Feature 6: Did the interview match the job description?
ALTER TABLE interviews ADD COLUMN jd_accuracy TEXT
  CHECK (jd_accuracy IN ('yes', 'somewhat', 'no'));
