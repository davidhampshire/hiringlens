-- Extra dummy companies for search testing
-- Run this in the Supabase SQL editor after the initial seed

INSERT INTO companies (name, slug, industry, location) VALUES
  ('Accenture Digital', 'accenture-digital', 'Consulting', 'London'),
  ('Spotify UK', 'spotify-uk', 'Technology', 'London'),
  ('Monzo Bank', 'monzo-bank', 'Finance & Banking', 'London'),
  ('Deliveroo', 'deliveroo', 'Technology', 'London'),
  ('BBC Studios', 'bbc-studios', 'Media & Entertainment', 'Manchester'),
  ('Rolls-Royce', 'rolls-royce', 'Manufacturing', 'Derby'),
  ('AstraZeneca', 'astrazeneca', 'Healthcare', 'Cambridge'),
  ('Revolut', 'revolut', 'Finance & Banking', 'London'),
  ('Sky Group', 'sky-group', 'Telecommunications', 'London'),
  ('Ocado Technology', 'ocado-technology', 'Retail & E-commerce', 'Hatfield');

-- Add some approved interviews for the new companies so they appear in search results

INSERT INTO interviews (company_id, role_title, seniority, location, interview_type, stages_count, total_duration_days, outcome, received_feedback, unpaid_task, ghosted, interviewer_late, exceeded_timeline, professionalism_rating, communication_rating, clarity_rating, fairness_rating, overall_comments, candidate_tip, status) VALUES
  -- Accenture Digital
  ((SELECT id FROM companies WHERE slug = 'accenture-digital'), 'Technology Consultant', 'mid', 'London', 'hybrid', 4, 28, 'offer', true, false, false, false, false, 4, 4, 4, 4, 'Classic consulting process with case studies and competency questions. Well organised.', 'Prepare examples using the STAR method. They focus heavily on leadership potential.', 'approved'),

  -- Spotify UK
  ((SELECT id FROM companies WHERE slug = 'spotify-uk'), 'Data Engineer', 'senior', 'London', 'remote', 5, 35, 'rejected', true, false, false, false, true, 4, 5, 4, 4, 'Great interviewers but the process took longer than communicated. Enjoyed the system design round.', 'Be prepared for a live coding session and a system design round. Culture fit is important to them.', 'approved'),

  -- Monzo Bank
  ((SELECT id FROM companies WHERE slug = 'monzo-bank'), 'iOS Developer', 'mid', 'London', 'remote', 3, 14, 'offer', true, false, false, false, false, 5, 5, 5, 5, 'Incredible process. Fast, transparent, and genuinely pleasant. Best interview I have done.', 'Focus on Swift and clean architecture. They pair programme during the technical round.', 'approved'),
  ((SELECT id FROM companies WHERE slug = 'monzo-bank'), 'Product Manager', 'senior', 'London', 'hybrid', 4, 21, 'rejected', true, false, false, false, false, 5, 4, 5, 5, 'Very thoughtful process. Even though I did not get the role, the feedback was actionable.', 'Prepare a product case study. They care about analytical thinking and customer empathy.', 'approved'),

  -- Deliveroo
  ((SELECT id FROM companies WHERE slug = 'deliveroo'), 'Backend Engineer', 'mid', 'London', 'hybrid', 4, 21, 'ghosted', false, false, true, false, true, 2, 2, 3, 2, 'After the onsite they went completely silent. Chased three times with no response.', 'Do not rely on this as your only option. They have a reputation for ghosting candidates.', 'approved'),
  ((SELECT id FROM companies WHERE slug = 'deliveroo'), 'UX Researcher', 'junior', 'London', 'remote', 3, 14, 'offer', true, false, false, false, false, 4, 4, 4, 4, 'Straightforward process. Portfolio review, case study, and team chat. Quick turnaround.', 'Have a strong portfolio with clear research methodology examples.', 'approved'),

  -- BBC Studios
  ((SELECT id FROM companies WHERE slug = 'bbc-studios'), 'Software Developer', 'mid', 'Manchester', 'onsite', 3, 21, 'offer', true, false, false, false, false, 5, 4, 4, 5, 'Very professional and respectful. They really care about diversity and inclusion.', 'Prepare for competency-based questions. Public sector values are important here.', 'approved'),

  -- Rolls-Royce
  ((SELECT id FROM companies WHERE slug = 'rolls-royce'), 'Mechanical Engineer', 'senior', 'Derby', 'onsite', 5, 42, 'offer', true, false, false, false, true, 4, 3, 4, 4, 'Thorough but slow process. Multiple technical assessments and panel interviews.', 'Brush up on thermodynamics and materials science. Security clearance takes time.', 'approved'),

  -- AstraZeneca
  ((SELECT id FROM companies WHERE slug = 'astrazeneca'), 'Data Scientist', 'mid', 'Cambridge', 'hybrid', 4, 28, 'rejected', true, false, false, false, false, 4, 4, 4, 4, 'Well structured. Technical test followed by panel interview. Good feedback provided.', 'Knowledge of clinical trial data and regulatory frameworks is a plus.', 'approved'),

  -- Revolut
  ((SELECT id FROM companies WHERE slug = 'revolut'), 'Frontend Developer', 'mid', 'London', 'remote', 5, 28, 'offer', false, true, false, false, true, 3, 2, 3, 2, 'Intense process with a take-home that took over 8 hours. Felt like working for free.', 'Be prepared for a very demanding take-home task. The pace is relentless.', 'approved'),
  ((SELECT id FROM companies WHERE slug = 'revolut'), 'Compliance Analyst', 'junior', 'London', 'onsite', 3, 14, 'rejected', true, false, false, true, false, 3, 3, 3, 3, 'Interviewer was 15 minutes late to the final round. Otherwise a standard process.', 'Research fintech regulations thoroughly. They test attention to detail.', 'approved'),

  -- Sky Group
  ((SELECT id FROM companies WHERE slug = 'sky-group'), 'DevOps Engineer', 'senior', 'London', 'hybrid', 4, 21, 'offer', true, false, false, false, false, 4, 4, 4, 4, 'Good technical assessment focused on real-world scenarios. Team was friendly and open.', 'Know your CI/CD pipelines and cloud infrastructure well. Kubernetes experience is a plus.', 'approved'),

  -- Ocado Technology
  ((SELECT id FROM companies WHERE slug = 'ocado-technology'), 'Robotics Engineer', 'senior', 'Hatfield', 'onsite', 4, 28, 'offer', true, false, false, false, false, 5, 4, 5, 5, 'Fascinating technical challenges. Got to see the warehouse robots in action during the visit.', 'Strong algorithms knowledge is essential. They love candidates who are passionate about robotics.', 'approved'),
  ((SELECT id FROM companies WHERE slug = 'ocado-technology'), 'Full Stack Developer', 'mid', 'Hatfield', 'hybrid', 3, 14, 'rejected', true, false, false, false, false, 4, 4, 3, 4, 'Decent process but the role requirements were not clearly communicated upfront.', 'Clarify the tech stack before applying. It changed between the job listing and the interview.', 'approved');
