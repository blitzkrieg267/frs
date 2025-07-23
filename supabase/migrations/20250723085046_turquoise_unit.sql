/*
  # Initial Database Schema for Financial Regulatory Platform

  1. New Tables
    - `documents` - Regulatory documents (acts, regulations, policies, etc.)
    - `news_updates` - News articles and regulatory updates
    - `events` - Regulatory events, conferences, workshops
    - `faqs` - Frequently asked questions
    - `user_profiles` - Extended user profile information

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and admin access
    - Create admin role for content management

  3. Features
    - Full-text search capabilities
    - Content categorization and tagging
    - User role-based access control
    - Audit trails for content changes
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Documents table for regulatory documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('act', 'regulation', 'policy', 'rule', 'directive', 'guideline', 'form')),
  regulator text NOT NULL,
  category text NOT NULL,
  file_url text,
  file_size text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  entity_types text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- News updates table
CREATE TABLE IF NOT EXISTS news_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  summary text NOT NULL,
  regulator text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date timestamptz NOT NULL,
  end_date timestamptz,
  location text NOT NULL,
  regulator text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  registration_required boolean DEFAULT false,
  registration_url text,
  max_participants integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  regulator text NOT NULL,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- User profiles table for extended user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  company text,
  role text,
  entity_type text,
  license_number text,
  phone text,
  regulatory_body text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_documents_regulator ON documents(regulator);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_news_search ON news_updates USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX IF NOT EXISTS idx_news_regulator ON news_updates(regulator);
CREATE INDEX IF NOT EXISTS idx_news_status ON news_updates(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON news_updates(published_at);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_regulator ON events(regulator);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

CREATE INDEX IF NOT EXISTS idx_faqs_search ON faqs USING gin(to_tsvector('english', question || ' ' || answer));
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_priority ON faqs(priority);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Documents are viewable by everyone" ON documents
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admin users can manage documents" ON documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- RLS Policies for news_updates
CREATE POLICY "Published news are viewable by everyone" ON news_updates
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admin users can manage news" ON news_updates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- RLS Policies for events
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Admin users can manage events" ON events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- RLS Policies for faqs
CREATE POLICY "Active FAQs are viewable by everyone" ON faqs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Admin users can manage FAQs" ON faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin users can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() 
      AND up.is_admin = true
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, is_admin)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    CASE WHEN new.email LIKE '%admin%' THEN true ELSE false END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news_updates
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample data for testing
INSERT INTO documents (title, description, type, regulator, category, tags, entity_types, created_by) VALUES
('Banking Act (Cap 46:04)', 'Comprehensive legislation governing banking operations in Botswana', 'act', 'Bank of Botswana', 'Primary Legislation', ARRAY['banking', 'legislation', 'licensing'], ARRAY['Commercial Bank', 'Investment Bank'], (SELECT id FROM auth.users LIMIT 1)),
('AML/CFT Guidelines', 'Guidelines for anti-money laundering and counter-terrorist financing compliance', 'guideline', 'Financial Intelligence Agency', 'Compliance Guidelines', ARRAY['AML', 'CFT', 'compliance'], ARRAY['All Financial Institutions'], (SELECT id FROM auth.users LIMIT 1)),
('Insurance Industry Act', 'Primary legislation for insurance companies and intermediaries', 'act', 'NBFIRA', 'Primary Legislation', ARRAY['insurance', 'legislation', 'licensing'], ARRAY['Life Insurance', 'General Insurance'], (SELECT id FROM auth.users LIMIT 1));

INSERT INTO news_updates (title, content, summary, regulator, category, tags, status, published_at, created_by) VALUES
('New Capital Adequacy Requirements Announced', 'Bank of Botswana has announced enhanced capital adequacy requirements for commercial banks, effective from Q2 2024. The new requirements align with Basel III standards and include additional buffers for systemically important banks.', 'BoB announces enhanced capital adequacy requirements for commercial banks', 'Bank of Botswana', 'Regulatory Updates', ARRAY['capital adequacy', 'basel III', 'banking'], 'published', now(), (SELECT id FROM auth.users LIMIT 1)),
('Updated AML Guidelines Released', 'The Financial Intelligence Agency has released updated anti-money laundering guidelines incorporating new international standards and enhanced due diligence requirements.', 'FIA releases updated AML guidelines with enhanced requirements', 'Financial Intelligence Agency', 'Policy Updates', ARRAY['AML', 'guidelines', 'compliance'], 'published', now(), (SELECT id FROM auth.users LIMIT 1));

INSERT INTO events (title, description, event_date, location, regulator, category, tags, created_by) VALUES
('Annual Banking Supervision Conference 2024', 'Annual conference bringing together banking sector stakeholders to discuss regulatory developments and industry trends', '2024-06-15 09:00:00+02', 'Gaborone International Convention Centre', 'Bank of Botswana', 'Conference', ARRAY['banking', 'supervision', 'conference'], (SELECT id FROM auth.users LIMIT 1)),
('Insurance Industry Workshop', 'Workshop on new solvency requirements for insurance companies', '2024-05-20 14:00:00+02', 'NBFIRA Offices, Gaborone', 'NBFIRA', 'Workshop', ARRAY['insurance', 'solvency', 'workshop'], (SELECT id FROM auth.users LIMIT 1));

INSERT INTO faqs (question, answer, category, regulator, tags, priority, created_by) VALUES
('How do I apply for a banking license?', 'To apply for a banking license, you need to submit a comprehensive application including business plan, financial projections, management team details, and meet minimum capital requirements. Contact the Banking Supervision Department for detailed requirements.', 'Licensing', 'Bank of Botswana', ARRAY['licensing', 'banking', 'application'], 10, (SELECT id FROM auth.users LIMIT 1)),
('What are the AML reporting requirements?', 'Financial institutions must report suspicious transactions within 3 days of detection, file cash transaction reports for amounts exceeding P30,000, and maintain comprehensive AML policies and procedures.', 'Compliance', 'Financial Intelligence Agency', ARRAY['AML', 'reporting', 'compliance'], 9, (SELECT id FROM auth.users LIMIT 1));