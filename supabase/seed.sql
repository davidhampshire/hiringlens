-- Seed data for HiringLens development
-- Run this in the Supabase SQL editor after running all migrations

-- Companies
INSERT INTO companies (id, name, slug, industry, location) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'TechCorp', 'techcorp', 'Technology', 'London'),
  ('a0000000-0000-0000-0000-000000000002', 'FinanceHub', 'financehub', 'Finance & Banking', 'London'),
  ('a0000000-0000-0000-0000-000000000003', 'DesignStudio', 'designstudio', 'Media & Entertainment', 'Manchester'),
  ('a0000000-0000-0000-0000-000000000004', 'HealthTech Pro', 'healthtech-pro', 'Healthcare', 'Bristol'),
  ('a0000000-0000-0000-0000-000000000005', 'ConsultCo', 'consultco', 'Consulting', 'Edinburgh'),
  ('a0000000-0000-0000-0000-000000000006', 'RetailMax', 'retailmax', 'Retail & E-commerce', 'Birmingham'),
  ('a0000000-0000-0000-0000-000000000007', 'EduLearn', 'edulearn', 'Education', 'Leeds'),
  ('a0000000-0000-0000-0000-000000000008', 'GreenEnergy Ltd', 'greenenergy-ltd', 'Energy', 'Glasgow');

-- Interviews (status = 'approved' for seed data)
INSERT INTO interviews (company_id, role_title, seniority, location, interview_type, stages_count, total_duration_days, outcome, received_feedback, unpaid_task, ghosted, interviewer_late, exceeded_timeline, professionalism_rating, communication_rating, clarity_rating, fairness_rating, overall_comments, candidate_tip, status) VALUES
  -- TechCorp reviews
  ('a0000000-0000-0000-0000-000000000001', 'Frontend Developer', 'mid', 'London', 'remote', 4, 21, 'offer', true, false, false, false, false, 5, 4, 5, 5, 'Really smooth process. They were transparent about the timeline and what to expect at each stage.', 'Brush up on React hooks and system design basics. They value clear communication.', 'approved'),
  ('a0000000-0000-0000-0000-000000000001', 'Backend Engineer', 'senior', 'London', 'hybrid', 5, 35, 'rejected', true, false, false, false, true, 4, 3, 4, 4, 'Process was thorough but took longer than expected. Good technical challenges though.', 'Prepare for a take-home task that takes about 4 hours. Focus on clean code over features.', 'approved'),
  ('a0000000-0000-0000-0000-000000000001', 'Product Designer', 'mid', 'Remote', 'remote', 3, 14, 'offer', true, false, false, false, false, 5, 5, 5, 4, 'Excellent experience. The design challenge was realistic and well scoped.', 'Prepare a case study presentation. They care about your process, not just the final output.', 'approved'),
  ('a0000000-0000-0000-0000-000000000001', 'DevOps Engineer', 'senior', 'London', 'onsite', 4, 28, 'rejected', false, false, false, true, true, 3, 3, 3, 3, 'Mixed experience. Some interviewers were late and the process dragged on.', 'Ask about the team structure upfront. The role scope changed during the process.', 'approved'),

  -- FinanceHub reviews
  ('a0000000-0000-0000-0000-000000000002', 'Quantitative Analyst', 'mid', 'London', 'onsite', 6, 42, 'offer', true, false, false, false, true, 4, 4, 3, 4, 'Very rigorous process with multiple technical rounds. Took much longer than stated.', 'Strong maths and stats knowledge essential. Practice mental arithmetic.', 'approved'),
  ('a0000000-0000-0000-0000-000000000002', 'Software Engineer', 'junior', 'London', 'hybrid', 4, 21, 'ghosted', false, false, true, false, true, 2, 1, 2, 2, 'After 4 rounds and a take-home, they completely stopped responding. Very disappointing.', 'Be prepared that they may ghost you even after multiple rounds. Keep other options open.', 'approved'),
  ('a0000000-0000-0000-0000-000000000002', 'Data Analyst', 'mid', 'London', 'remote', 3, 14, 'rejected', true, false, false, false, false, 4, 4, 4, 4, 'Fair process overall. Got detailed feedback which was helpful for future applications.', 'SQL and Python skills are tested heavily. Prepare dashboarding examples.', 'approved'),

  -- DesignStudio reviews
  ('a0000000-0000-0000-0000-000000000003', 'UX Designer', 'senior', 'Manchester', 'onsite', 3, 10, 'offer', true, false, false, false, false, 5, 5, 5, 5, 'Best interview experience I have ever had. Warm, professional, and genuinely interested in my work.', 'Bring a portfolio with clear case studies. They love seeing your design thinking process.', 'approved'),
  ('a0000000-0000-0000-0000-000000000003', 'Motion Designer', 'mid', 'Remote', 'remote', 2, 7, 'offer', true, false, false, false, false, 5, 5, 4, 5, 'Quick and respectful process. Two conversations and a brief portfolio review.', 'Have examples of animation work ready. They value creativity over technical perfection.', 'approved'),
  ('a0000000-0000-0000-0000-000000000003', 'Brand Designer', 'junior', 'Manchester', 'hybrid', 3, 14, 'rejected', true, true, false, false, false, 3, 4, 3, 3, 'Asked to complete a 3-day design brief as part of the process. Felt like free work.', 'Be wary of the design task scope. Ask upfront how long it should take.', 'approved'),

  -- HealthTech Pro reviews
  ('a0000000-0000-0000-0000-000000000004', 'Full Stack Developer', 'mid', 'Bristol', 'hybrid', 4, 28, 'offer', true, false, false, false, false, 4, 4, 4, 4, 'Well structured process. Good mix of technical and cultural fit assessment.', 'Familiarise yourself with healthcare data regulations. They ask about GDPR awareness.', 'approved'),
  ('a0000000-0000-0000-0000-000000000004', 'QA Engineer', 'junior', 'Remote', 'remote', 3, 21, 'rejected', false, false, true, false, false, 2, 2, 3, 3, 'Never heard back after the final round. Had to chase multiple times for an update.', 'Follow up proactively. Their HR team can be slow to respond.', 'approved'),

  -- ConsultCo reviews
  ('a0000000-0000-0000-0000-000000000005', 'Management Consultant', 'junior', 'Edinburgh', 'onsite', 5, 35, 'offer', true, false, false, false, false, 4, 4, 4, 5, 'Classic consulting interview format. Case studies and behavioural questions. Well run.', 'Practice case study frameworks. They also test mental maths and market sizing.', 'approved'),
  ('a0000000-0000-0000-0000-000000000005', 'Strategy Analyst', 'mid', 'Edinburgh', 'hybrid', 4, 28, 'rejected', true, false, false, false, false, 5, 5, 5, 5, 'Even though I was rejected, the experience was excellent. Clear feedback and respectful throughout.', 'Research the firm recent projects. They appreciate candidates who show genuine interest.', 'approved'),

  -- RetailMax reviews
  ('a0000000-0000-0000-0000-000000000006', 'Product Manager', 'senior', 'Birmingham', 'hybrid', 5, 42, 'ghosted', false, true, true, true, true, 1, 1, 2, 1, 'Terrible experience. Five rounds, a presentation, and then complete radio silence. Interviewers were unprepared.', 'Think twice before applying. Check if the role is actually approved for hire first.', 'approved'),
  ('a0000000-0000-0000-0000-000000000006', 'Marketing Executive', 'junior', 'Birmingham', 'onsite', 2, 7, 'offer', true, false, false, false, false, 4, 3, 3, 4, 'Quick process. Two interviews in one day and an offer the next week.', 'Standard marketing questions. Prepare examples of campaign work.', 'approved'),

  -- EduLearn reviews
  ('a0000000-0000-0000-0000-000000000007', 'Curriculum Developer', 'mid', 'Leeds', 'remote', 3, 14, 'offer', true, false, false, false, false, 5, 5, 4, 5, 'Lovely team. They genuinely cared about finding the right fit for both sides.', 'Show passion for education. They care more about mission alignment than pure experience.', 'approved'),
  ('a0000000-0000-0000-0000-000000000007', 'Software Engineer', 'mid', 'Remote', 'remote', 4, 21, 'rejected', true, false, false, false, false, 4, 4, 4, 4, 'Good process. Clear communication and constructive feedback even though I did not get the role.', 'Expect to work through a pair programming exercise. Be vocal about your thinking.', 'approved'),

  -- GreenEnergy reviews
  ('a0000000-0000-0000-0000-000000000008', 'Data Scientist', 'senior', 'Glasgow', 'hybrid', 4, 28, 'offer', true, false, false, false, false, 4, 4, 5, 4, 'Interesting technical challenges related to energy data. Professional throughout.', 'Knowledge of time series analysis and forecasting is key. Python and SQL tested.', 'approved'),
  ('a0000000-0000-0000-0000-000000000008', 'Project Manager', 'mid', 'Glasgow', 'onsite', 3, 14, 'rejected', false, false, false, false, true, 3, 3, 2, 3, 'Process took longer than expected. Communication could have been better between stages.', 'Ask for clear timelines at each stage. They tend to stretch.', 'approved');
