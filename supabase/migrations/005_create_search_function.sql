-- Full-text search RPC function
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
) AS $$
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
$$ LANGUAGE plpgsql;
