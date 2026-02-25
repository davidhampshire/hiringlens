-- Add optional display name to interviews (anonymous by default)
ALTER TABLE interviews ADD COLUMN display_name TEXT;
