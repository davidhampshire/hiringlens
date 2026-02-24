-- ============================================================
-- Migration 007: User Profiles & Auth-Aware RLS
-- ============================================================

-- 1. Create profiles table linked to Supabase Auth
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_profiles_email ON profiles (email);

-- Reuse the update_updated_at trigger function from migration 001
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Add FK and index on interviews.submitted_by
ALTER TABLE interviews
  ADD CONSTRAINT fk_interviews_submitted_by
  FOREIGN KEY (submitted_by) REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_interviews_submitted_by ON interviews (submitted_by);

-- 5. Update interviews RLS policies for auth

-- Drop the old anon insert policy
DROP POLICY IF EXISTS "Anyone can submit an interview experience" ON interviews;

-- Authenticated users can submit (submitted_by must match their auth ID)
CREATE POLICY "Authenticated users can submit interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (status = 'pending' AND submitted_by = auth.uid());

-- Users can read their own interviews regardless of status (for /account page)
-- This works alongside the existing "Approved interviews are publicly readable" policy
-- via PostgreSQL's OR logic between same-command policies
CREATE POLICY "Users can read own interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (submitted_by = auth.uid());
