-- Migration: Add company_name field to survey_instances
-- Allows free-text company names instead of requiring company_id reference

ALTER TABLE survey_instances
ADD COLUMN IF NOT EXISTS company_name TEXT;

COMMENT ON COLUMN survey_instances.company_name IS 'Optional free-text company name for the survey instance';
