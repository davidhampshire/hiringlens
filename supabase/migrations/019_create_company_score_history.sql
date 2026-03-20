-- Company score history: daily snapshots to track Reality Score trends over time
CREATE TABLE company_score_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  reality_score numeric,
  total_reviews integer NOT NULL DEFAULT 0,
  snapshotted_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX ON company_score_history(company_id, snapshotted_at DESC);

-- RLS: only service role can read/write (cron job uses service role key)
ALTER TABLE company_score_history ENABLE ROW LEVEL SECURITY;

-- Seed initial snapshot so trend data is available from day one
INSERT INTO company_score_history (company_id, reality_score, total_reviews)
SELECT company_id, reality_score, total_reviews
FROM company_scores
WHERE total_reviews > 0;
