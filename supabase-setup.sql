-- GetLemons.XYZ Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  version TEXT,
  license TEXT,
  file_type TEXT,
  short_desc TEXT,
  full_desc TEXT,
  featured BOOLEAN DEFAULT FALSE,
  section TEXT,
  gallery TEXT[],
  download_url TEXT,
  installation_steps TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically update updated_at
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to assets
CREATE POLICY "Allow public read access"
  ON assets
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert assets
CREATE POLICY "Allow authenticated insert"
  ON assets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow anonymous users to insert assets (for admin panel without auth)
CREATE POLICY "Allow anonymous insert"
  ON assets
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to update assets
CREATE POLICY "Allow authenticated update"
  ON assets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to update assets (for admin panel without auth)
CREATE POLICY "Allow anonymous update"
  ON assets
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete assets
CREATE POLICY "Allow authenticated delete"
  ON assets
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow anonymous users to delete assets (for admin panel without auth)
CREATE POLICY "Allow anonymous delete"
  ON assets
  FOR DELETE
  TO anon
  USING (true);

-- Insert sample data (optional)
INSERT INTO assets (title, category, version, license, file_type, short_desc, full_desc, featured, section)
VALUES 
  ('EASE_COPY.JSX', 'AE Scripts', 'v2.4', 'MIT', '.JSX', 
   'Copy/Paste keyframe distinct curves.', 
   'A precise utility for copying easing data between keys without affecting values. Essential for graph editor workflows.',
   true, 'repository'),
  ('LAYER_RENAMER', 'AE Scripts', 'CC24', 'Commercial', '.JSXBIN',
   'Regex-based batch renaming tool.',
   'Terminal-style renaming utility. Supports Grep, Append, Prepend, and Search/Replace logic for heavy comps.',
   false, 'repository');

-- Create a view for featured assets (optional)
CREATE OR REPLACE VIEW featured_assets AS
SELECT * FROM assets
WHERE featured = true
ORDER BY created_at DESC;

-- Migration: Add download_url column to existing tables (run if upgrading)
-- Uncomment the line below if you already have an assets table without download_url:
-- ALTER TABLE assets ADD COLUMN IF NOT EXISTS download_url TEXT;

-- Migration: Add installation_steps column to existing tables (run if upgrading)
-- Uncomment the line below if you already have an assets table without installation_steps:
-- ALTER TABLE assets ADD COLUMN IF NOT EXISTS installation_steps TEXT[];
