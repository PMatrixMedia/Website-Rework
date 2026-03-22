-- Fix: "null value in column id of relation contact_submissions violates not-null constraint"
--
-- Cause: `id` has no DEFAULT (e.g. table created as INTEGER PRIMARY KEY without SERIAL/IDENTITY).
-- Run this once on your Postgres (Supabase SQL editor, psql, or Hasura Data → SQL).
--
-- If `id` is already SERIAL and this errors, skip to "Verify" at the bottom.

-- 1) Create sequence and attach default (safe if sequence already exists from SERIAL)
CREATE SEQUENCE IF NOT EXISTS contact_submissions_id_seq;

-- 2) Align sequence with existing rows (empty table → next id will be 1)
SELECT setval(
  'contact_submissions_id_seq',
  COALESCE((SELECT MAX(id) FROM contact_submissions), 0)
);

-- 3) Attach default so INSERT without id gets the next value
ALTER TABLE contact_submissions
  ALTER COLUMN id SET DEFAULT nextval('contact_submissions_id_seq');

ALTER SEQUENCE contact_submissions_id_seq OWNED BY contact_submissions.id;

-- Verify: \d contact_submissions in psql — id should show "nextval(...)"
-- Test insert (optional):
-- INSERT INTO contact_submissions (name, email, message) VALUES ('Test', 't@example.com', 'hi');
-- ROLLBACK;
