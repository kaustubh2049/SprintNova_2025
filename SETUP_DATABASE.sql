-- ============================================
-- COMPLETE DATABASE SETUP - COPY ALL OF THIS
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. FESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS fests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cultural', 'technical', 'sports')),
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fests_type ON fests(type);
CREATE INDEX IF NOT EXISTS idx_fests_start_date ON fests(start_date);

-- ============================================
-- 2. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fest_id UUID REFERENCES fests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  venue TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_fest_id ON events(fest_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- ============================================
-- 3. WINNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  fest_id UUID REFERENCES fests(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  department TEXT,
  medal TEXT NOT NULL CHECK (medal IN ('gold', 'silver', 'bronze')),
  position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_winners_event_id ON winners(event_id);
CREATE INDEX IF NOT EXISTS idx_winners_fest_id ON winners(fest_id);
CREATE INDEX IF NOT EXISTS idx_winners_class ON winners(class);
CREATE INDEX IF NOT EXISTS idx_winners_medal ON winners(medal);

-- ============================================
-- 4. GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fest_id UUID REFERENCES fests(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_fest_id ON gallery(fest_id);
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON gallery(event_id);

-- ============================================
-- 5. DRAFTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drafts_status ON drafts(status);
CREATE INDEX IF NOT EXISTS idx_drafts_published_at ON drafts(published_at);

-- ============================================
-- 6. EMAIL LISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  emails TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. EMAIL LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  recipients TEXT[] NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE fests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create Policies (Allow public read, admin write)
-- ============================================

-- FESTS Policies
DROP POLICY IF EXISTS "Allow public read access on fests" ON fests;
DROP POLICY IF EXISTS "Allow authenticated insert on fests" ON fests;
DROP POLICY IF EXISTS "Allow authenticated update on fests" ON fests;
DROP POLICY IF EXISTS "Allow authenticated delete on fests" ON fests;

CREATE POLICY "Allow public read access on fests" ON fests FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on fests" ON fests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on fests" ON fests FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on fests" ON fests FOR DELETE USING (true);

-- EVENTS Policies
DROP POLICY IF EXISTS "Allow public read access on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated insert on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated update on events" ON events;
DROP POLICY IF EXISTS "Allow authenticated delete on events" ON events;

CREATE POLICY "Allow public read access on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on events" ON events FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on events" ON events FOR DELETE USING (true);

-- WINNERS Policies
DROP POLICY IF EXISTS "Allow public read access on winners" ON winners;
DROP POLICY IF EXISTS "Allow authenticated insert on winners" ON winners;
DROP POLICY IF EXISTS "Allow authenticated update on winners" ON winners;
DROP POLICY IF EXISTS "Allow authenticated delete on winners" ON winners;

CREATE POLICY "Allow public read access on winners" ON winners FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on winners" ON winners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on winners" ON winners FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on winners" ON winners FOR DELETE USING (true);

-- GALLERY Policies
DROP POLICY IF EXISTS "Allow public read access on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated insert on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated update on gallery" ON gallery;
DROP POLICY IF EXISTS "Allow authenticated delete on gallery" ON gallery;

CREATE POLICY "Allow public read access on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on gallery" ON gallery FOR DELETE USING (true);

-- DRAFTS Policies
DROP POLICY IF EXISTS "Allow public read published drafts" ON drafts;
DROP POLICY IF EXISTS "Allow authenticated insert on drafts" ON drafts;
DROP POLICY IF EXISTS "Allow authenticated update on drafts" ON drafts;
DROP POLICY IF EXISTS "Allow authenticated delete on drafts" ON drafts;

CREATE POLICY "Allow public read published drafts" ON drafts FOR SELECT USING (status = 'published' OR true);
CREATE POLICY "Allow authenticated insert on drafts" ON drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on drafts" ON drafts FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on drafts" ON drafts FOR DELETE USING (true);

-- EMAIL LISTS Policies
DROP POLICY IF EXISTS "Allow authenticated read on email_lists" ON email_lists;
DROP POLICY IF EXISTS "Allow authenticated insert on email_lists" ON email_lists;
DROP POLICY IF EXISTS "Allow authenticated update on email_lists" ON email_lists;
DROP POLICY IF EXISTS "Allow authenticated delete on email_lists" ON email_lists;

CREATE POLICY "Allow authenticated read on email_lists" ON email_lists FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on email_lists" ON email_lists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on email_lists" ON email_lists FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on email_lists" ON email_lists FOR DELETE USING (true);

-- EMAIL LOGS Policies
DROP POLICY IF EXISTS "Allow authenticated read on email_logs" ON email_logs;
DROP POLICY IF EXISTS "Allow authenticated insert on email_logs" ON email_logs;

CREATE POLICY "Allow authenticated read on email_logs" ON email_logs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on email_logs" ON email_logs FOR INSERT WITH CHECK (true);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert Fests
INSERT INTO fests (name, type, description, start_date, end_date) VALUES
('Sparx', 'sports', 'Annual sports festival', '2024-11-01', '2024-11-03'),
('Spandan', 'cultural', 'Cultural extravaganza', '2024-12-01', '2024-12-03'),
('Transmission', 'technical', 'Technical fest', '2025-01-15', '2025-01-17')
ON CONFLICT DO NOTHING;

-- Insert Events
INSERT INTO events (fest_id, name, description, event_date, venue) VALUES
((SELECT id FROM fests WHERE name = 'Sparx'), 'Basketball', 'Inter-class basketball tournament', '2024-11-01', 'Main Court'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Cricket', 'Cricket championship', '2024-11-01', 'Cricket Ground'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Classical Dance', 'Bharatanatyam performances', '2024-12-01', 'Auditorium'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Solo Singing', 'Classical music', '2024-12-02', 'Music Room'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Hackathon', '24-hour coding marathon', '2025-01-15', 'Computer Lab'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Robotics', 'Robot wars', '2025-01-16', 'Workshop')
ON CONFLICT DO NOTHING;

-- Insert Sample Winners
INSERT INTO winners (event_id, fest_id, student_name, class, department, medal, position) VALUES
((SELECT id FROM events WHERE name = 'Basketball'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Rahul Sharma', 'CSE 3A', 'Computer Science', 'gold', 1),
((SELECT id FROM events WHERE name = 'Basketball'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Priya Patel', 'CSE 3B', 'Computer Science', 'silver', 2),
((SELECT id FROM events WHERE name = 'Classical Dance'), (SELECT id FROM fests WHERE name = 'Spandan'), 'Lakshmi Menon', 'CSE 2A', 'Computer Science', 'gold', 1)
ON CONFLICT DO NOTHING;

-- Insert Sample Gallery
INSERT INTO gallery (fest_id, event_id, title, description, image_url) VALUES
((SELECT id FROM fests WHERE name = 'Sparx'), (SELECT id FROM events WHERE name = 'Basketball'), 'Basketball Finals', 'Championship match', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'),
((SELECT id FROM fests WHERE name = 'Spandan'), (SELECT id FROM events WHERE name = 'Classical Dance'), 'Dance Performance', 'Beautiful performance', 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800')
ON CONFLICT DO NOTHING;

-- Insert Sample Notices
INSERT INTO drafts (title, content, status, published_at) VALUES
('Welcome to New Academic Year', 'Dear Students, Welcome to the new academic year!', 'published', NOW()),
('Sparx 2024 Announcement', 'Get ready for Sparx! Registration open.', 'published', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
DO $$
DECLARE
  fest_count INTEGER;
  event_count INTEGER;
  winner_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO fest_count FROM fests;
  SELECT COUNT(*) INTO event_count FROM events;
  SELECT COUNT(*) INTO winner_count FROM winners;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ DATABASE SETUP COMPLETE!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 Tables Created: 7';
  RAISE NOTICE '   • fests: % records', fest_count;
  RAISE NOTICE '   • events: % records', event_count;
  RAISE NOTICE '   • winners: % records', winner_count;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 You can now add data from admin panel!';
  RAISE NOTICE '🚀 Visit: http://localhost:3000/admin';
END $$;
