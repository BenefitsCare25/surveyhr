-- Migration: Survey Configuration System
-- Enables admin to create survey templates and generate custom survey links

-- =====================================================
-- 1. COMPANIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. SURVEY TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS survey_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. SURVEY INSTANCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS survey_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES survey_templates(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  url_slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_survey_instances_url_slug ON survey_instances(url_slug);
CREATE INDEX idx_survey_instances_company_id ON survey_instances(company_id);

-- =====================================================
-- 4. SURVEY QUESTION VISIBILITY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS survey_question_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL, -- Can reference template_id or instance_id
  config_type TEXT NOT NULL CHECK (config_type IN ('template', 'instance')),
  category_id TEXT NOT NULL,
  question_id TEXT, -- NULL means entire category visibility
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(config_id, config_type, category_id, question_id)
);

CREATE INDEX idx_question_visibility_config ON survey_question_visibility(config_id, config_type);

-- =====================================================
-- 5. MODIFY SURVEY_RESPONSES TABLE
-- =====================================================
ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS instance_id UUID REFERENCES survey_instances(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_survey_responses_instance_id ON survey_responses(instance_id);

-- =====================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_question_visibility ENABLE ROW LEVEL SECURITY;

-- Public read access to companies
CREATE POLICY "Public read companies" ON companies
  FOR SELECT USING (true);

-- Public read access to templates
CREATE POLICY "Public read templates" ON survey_templates
  FOR SELECT USING (true);

-- Public read access to active instances
CREATE POLICY "Public read active instances" ON survey_instances
  FOR SELECT USING (is_active = true);

-- Public read access to question visibility
CREATE POLICY "Public read question visibility" ON survey_question_visibility
  FOR SELECT USING (true);

-- Admin write access (Note: In production, replace with proper auth)
-- For now, allow all operations for development
CREATE POLICY "Admin manage companies" ON companies
  FOR ALL USING (true);

CREATE POLICY "Admin manage templates" ON survey_templates
  FOR ALL USING (true);

CREATE POLICY "Admin manage instances" ON survey_instances
  FOR ALL USING (true);

CREATE POLICY "Admin manage visibility" ON survey_question_visibility
  FOR ALL USING (true);

-- =====================================================
-- 7. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for companies
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for templates
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON survey_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================

-- Insert default "All Questions" template
INSERT INTO survey_templates (name, description)
VALUES ('Default Template', 'All categories and questions enabled')
ON CONFLICT DO NOTHING;

-- Insert sample company
INSERT INTO companies (name, contact_email)
VALUES ('Sample Company Inc', 'contact@sample.com')
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE companies IS 'Stores client companies that receive surveys';
COMMENT ON TABLE survey_templates IS 'Reusable survey configuration templates';
COMMENT ON TABLE survey_instances IS 'Generated survey links with specific configurations';
COMMENT ON TABLE survey_question_visibility IS 'Controls which questions are visible in each template/instance';
COMMENT ON COLUMN survey_question_visibility.question_id IS 'NULL means category-level visibility control';
