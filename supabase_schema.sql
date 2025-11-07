-- Supabase SQL Schema for HR Survey System
-- Run this in your Supabase SQL Editor

-- Create the survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Metadata
  company_name TEXT NOT NULL,
  respondent_name TEXT NOT NULL,
  respondent_email TEXT NOT NULL,
  quarter TEXT,
  policy_year TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Survey data stored as JSONB for flexibility
  scores JSONB NOT NULL,
  comments JSONB NOT NULL,

  -- Calculated values
  total_score NUMERIC(10, 2),
  max_possible_score NUMERIC(10, 2),
  percentage_score NUMERIC(5, 2),

  -- Indexes for common queries
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_company ON survey_responses(company_name);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted ON survey_responses(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON survey_responses(respondent_email);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for public survey submissions)
CREATE POLICY "Allow public insert" ON survey_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create a policy to allow reading (you can modify this based on your security needs)
-- For now, this allows anyone to read responses. You may want to restrict this.
CREATE POLICY "Allow public read" ON survey_responses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Optional: Create a view for easy reporting
CREATE OR REPLACE VIEW survey_summary AS
SELECT
  id,
  company_name,
  respondent_name,
  quarter,
  policy_year,
  submitted_at,
  total_score,
  max_possible_score,
  percentage_score,
  CASE
    WHEN percentage_score >= 80 THEN 'Excellent'
    WHEN percentage_score >= 60 THEN 'Good'
    WHEN percentage_score >= 40 THEN 'Fair'
    ELSE 'Poor'
  END as rating_category
FROM survey_responses
ORDER BY submitted_at DESC;

-- Grant access to the view
GRANT SELECT ON survey_summary TO anon, authenticated;

COMMENT ON TABLE survey_responses IS 'Stores quarterly broker service level assessment survey responses from company HR';
COMMENT ON COLUMN survey_responses.scores IS 'JSONB object containing category_id -> question_id -> rating (1-5)';
COMMENT ON COLUMN survey_responses.comments IS 'JSONB object containing category_id -> comment text';
