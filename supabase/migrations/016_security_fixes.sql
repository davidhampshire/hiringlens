-- =============================================================
-- 016: Security Advisor fixes
-- Resolves: SECURITY DEFINER view, mutable search_path on
-- functions, and overly-permissive RLS policies.
-- =============================================================

-- -----------------------------------------------------------
-- 1. FIX: company_scores view — remove SECURITY DEFINER
--    Recreate as a plain (SECURITY INVOKER) view so it
--    respects the calling user's RLS policies.
-- -----------------------------------------------------------
DROP VIEW IF EXISTS company_scores;

CREATE VIEW company_scores WITH (security_invoker = true) AS
SELECT
  c.id AS company_id,
  c.name,
  c.slug,
  c.industry,
  c.location,
  c.logo_url,
  c.website_url,
  COUNT(i.id)::INTEGER AS total_reviews,
  ROUND(AVG(i.professionalism_rating)::NUMERIC, 1) AS avg_professionalism,
  ROUND(AVG(i.communication_rating)::NUMERIC, 1) AS avg_communication,
  ROUND(AVG(i.clarity_rating)::NUMERIC, 1) AS avg_clarity,
  ROUND(AVG(i.fairness_rating)::NUMERIC, 1) AS avg_fairness,
  ROUND(AVG(CASE WHEN i.ghosted THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_ghosted,
  ROUND(AVG(CASE WHEN i.unpaid_task THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_unpaid_task,
  ROUND(AVG(CASE WHEN i.exceeded_timeline THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_exceeded_timeline,
  ROUND(AVG(CASE WHEN NOT i.received_feedback THEN 1.0 ELSE 0.0 END)::NUMERIC, 2) AS pct_no_feedback,
  ROUND(AVG(i.stages_count)::NUMERIC, 1) AS avg_stages,
  ROUND(AVG(i.total_duration_days)::NUMERIC, 0) AS avg_duration_days,
  compute_reality_score(
    AVG(i.professionalism_rating),
    AVG(i.communication_rating),
    AVG(i.clarity_rating),
    AVG(i.fairness_rating),
    AVG(CASE WHEN i.ghosted THEN 1.0 ELSE 0.0 END),
    AVG(CASE WHEN i.unpaid_task THEN 1.0 ELSE 0.0 END),
    AVG(CASE WHEN i.exceeded_timeline THEN 1.0 ELSE 0.0 END),
    AVG(CASE WHEN NOT i.received_feedback THEN 1.0 ELSE 0.0 END)
  ) AS reality_score
FROM companies c
LEFT JOIN interviews i ON i.company_id = c.id AND i.status = 'approved'
GROUP BY c.id, c.name, c.slug, c.industry, c.location, c.logo_url, c.website_url;


-- -----------------------------------------------------------
-- 2. FIX: Set search_path on all functions to prevent
--    schema injection attacks.
-- -----------------------------------------------------------

-- update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_company_responses_updated_at
CREATE OR REPLACE FUNCTION update_company_responses_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- compute_reality_score
CREATE OR REPLACE FUNCTION compute_reality_score(
  avg_prof NUMERIC,
  avg_comm NUMERIC,
  avg_clarity NUMERIC,
  avg_fairness NUMERIC,
  pct_ghosted NUMERIC,
  pct_unpaid NUMERIC,
  pct_exceeded NUMERIC,
  pct_no_feedback NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  base_score NUMERIC;
  penalty NUMERIC;
BEGIN
  base_score := (COALESCE(avg_prof, 0) + COALESCE(avg_comm, 0) + COALESCE(avg_clarity, 0) + COALESCE(avg_fairness, 0)) / 4.0 * 20.0;
  penalty := (COALESCE(pct_ghosted, 0) * 15.0)
           + (COALESCE(pct_unpaid, 0) * 10.0)
           + (COALESCE(pct_exceeded, 0) * 10.0)
           + (COALESCE(pct_no_feedback, 0) * 5.0);
  RETURN GREATEST(0, ROUND(base_score - penalty, 1));
END;
$$;

-- search_companies
CREATE OR REPLACE FUNCTION search_companies(search_query TEXT, result_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  industry TEXT,
  location TEXT,
  logo_url TEXT,
  total_reviews BIGINT,
  reality_score NUMERIC,
  rank REAL
)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.industry,
    c.location,
    c.logo_url,
    COALESCE(cs.total_reviews::BIGINT, 0) AS total_reviews,
    COALESCE(cs.reality_score, 0) AS reality_score,
    ts_rank(c.fts, plainto_tsquery('english', search_query)) AS rank
  FROM companies c
  LEFT JOIN company_scores cs ON cs.company_id = c.id
  WHERE c.fts @@ plainto_tsquery('english', search_query)
     OR c.name ILIKE '%' || search_query || '%'
  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$;


-- -----------------------------------------------------------
-- 3. FIX: Tighten overly-permissive RLS policies
-- -----------------------------------------------------------

-- 3a. companies: keep public read, but restrict INSERT to authenticated only
DROP POLICY IF EXISTS "Anyone can create companies" ON companies;
CREATE POLICY "Authenticated users can create companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 3b. contact_messages: restrict INSERT to rate-limit-friendly check
--     (still open to anon, but explicit about what's allowed)
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Only allow inserting messages with required fields present
    name IS NOT NULL AND email IS NOT NULL AND message IS NOT NULL
  );

-- 3c. moderation_flags: restrict read to admins only, keep insert for flagging
DROP POLICY IF EXISTS "Only authenticated users can read flags" ON moderation_flags;
CREATE POLICY "Admins can read moderation flags"
  ON moderation_flags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- moderation_flags insert: require interview_id to be present
DROP POLICY IF EXISTS "Anyone can flag content" ON moderation_flags;
CREATE POLICY "Anyone can flag content"
  ON moderation_flags FOR INSERT
  TO anon, authenticated
  WITH CHECK (interview_id IS NOT NULL);
