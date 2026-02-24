-- Companies table
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  industry TEXT,
  location TEXT,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_companies_slug ON companies (slug);
CREATE INDEX idx_companies_industry ON companies (industry);

-- Full-text search
ALTER TABLE companies ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(industry, '') || ' ' || coalesce(location, ''))) STORED;

CREATE INDEX idx_companies_fts ON companies USING GIN (fts);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
