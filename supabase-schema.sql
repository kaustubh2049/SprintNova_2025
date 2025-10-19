-- Supabase Database Schema for XIE Student Council Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fests Table
CREATE TABLE fests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('cultural', 'technical', 'sports')),
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fest_id UUID NOT NULL REFERENCES fests(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  venue VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Winners Table
CREATE TABLE winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  class_name VARCHAR(100) NOT NULL,
  department VARCHAR(255) NOT NULL,
  medal VARCHAR(20) NOT NULL CHECK (medal IN ('gold', 'silver', 'bronze')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fest_id UUID NOT NULL REFERENCES fests(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drafts Table
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Logs Table
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  recipients TEXT[] NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed'))
);

-- Create indexes for better query performance
CREATE INDEX idx_events_fest_id ON events(fest_id);
CREATE INDEX idx_winners_event_id ON winners(event_id);
CREATE INDEX idx_gallery_fest_id ON gallery(fest_id);
CREATE INDEX idx_gallery_event_id ON gallery(event_id);
CREATE INDEX idx_drafts_status ON drafts(status);
CREATE INDEX idx_email_logs_draft_id ON email_logs(draft_id);

-- Enable Row Level Security (RLS)
ALTER TABLE fests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public read access for fests" ON fests FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for winners" ON winners FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for published drafts" ON drafts FOR SELECT USING (status = 'published');

-- RLS Policies for admin write access (you'll need to customize these based on your auth setup)
-- For now, allowing all authenticated users to write (you should restrict this to admin users only)
CREATE POLICY "Authenticated users can insert fests" ON fests FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update fests" ON fests FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete fests" ON fests FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON events FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete events" ON events FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert winners" ON winners FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update winners" ON winners FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete winners" ON winners FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete gallery" ON gallery FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert drafts" ON drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update drafts" ON drafts FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete drafts" ON drafts FOR DELETE USING (true);
CREATE POLICY "Authenticated users can read all drafts" ON drafts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert email_logs" ON email_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read email_logs" ON email_logs FOR SELECT USING (true);

-- Sample Data (Optional - for testing)
-- INSERT INTO fests (name, type, description, start_date, end_date) VALUES
-- ('Spandan 2024', 'cultural', 'Annual cultural fest celebrating arts, music, and dance', '2024-03-01', '2024-03-03'),
-- ('Transmission 2024', 'technical', 'Technical fest showcasing innovation and technology', '2024-02-15', '2024-02-17'),
-- ('Sparx 2024', 'sports', 'Sports fest with various athletic competitions', '2024-04-10', '2024-04-12');
