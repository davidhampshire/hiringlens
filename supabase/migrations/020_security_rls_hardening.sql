-- ============================================================
-- Migration 020: Security RLS Hardening
-- Adds explicit access-denial policies for utility tables that
-- rely on RLS enabled + no policy = service-role-only access.
-- Making this explicit protects against accidental policy changes.
-- ============================================================

-- ── company_score_history ────────────────────────────────────
-- This table is only written by the cron job (service role) and
-- read by server actions (service role). No public/auth access.
CREATE POLICY "No public read on score history"
  ON company_score_history FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "No public insert on score history"
  ON company_score_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "No public update on score history"
  ON company_score_history FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "No public delete on score history"
  ON company_score_history FOR DELETE
  TO anon, authenticated
  USING (false);

-- ── company_watchers ─────────────────────────────────────────
-- Anyone can INSERT (subscribe), but no one should be able to
-- SELECT, UPDATE, or DELETE watcher rows (service role only).
-- Protects subscriber email addresses from enumeration.
CREATE POLICY "No public read on watchers"
  ON company_watchers FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "No public update on watchers"
  ON company_watchers FOR UPDATE
  TO anon, authenticated
  USING (false);

CREATE POLICY "No public delete on watchers"
  ON company_watchers FOR DELETE
  TO anon, authenticated
  USING (false);
