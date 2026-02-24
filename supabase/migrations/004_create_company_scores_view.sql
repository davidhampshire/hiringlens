-- Reality Score computation function
CREATE OR REPLACE FUNCTION compute_reality_score(
  avg_prof NUMERIC,
  avg_comm NUMERIC,
  avg_clarity NUMERIC,
  avg_fairness NUMERIC,
  pct_ghosted NUMERIC,
  pct_unpaid NUMERIC,
  pct_exceeded NUMERIC,
  pct_no_feedback NUMERIC
) RETURNS NUMERIC AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Aggregated company scores view
CREATE OR REPLACE VIEW company_scores AS
SELECT
  c.id AS company_id,
  c.name,
  c.slug,
  c.industry,
  c.location,
  c.logo_url,
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
GROUP BY c.id, c.name, c.slug, c.industry, c.location, c.logo_url;
