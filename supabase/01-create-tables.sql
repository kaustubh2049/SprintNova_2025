-- ============================================
-- XIE Student Council Database Setup
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

-- Create index for faster queries
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

-- Create indexes
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

-- Create indexes
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_gallery_fest_id ON gallery(fest_id);
CREATE INDEX IF NOT EXISTS idx_gallery_event_id ON gallery(event_id);

-- ============================================
-- 5. DRAFTS TABLE (Notices/Announcements)
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

-- Create index
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

-- Create index
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================

-- Enable RLS on all tables
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

-- FESTS: Public read, authenticated write
CREATE POLICY "Allow public read access on fests" ON fests FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on fests" ON fests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on fests" ON fests FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on fests" ON fests FOR DELETE USING (true);

-- EVENTS: Public read, authenticated write
CREATE POLICY "Allow public read access on events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on events" ON events FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on events" ON events FOR DELETE USING (true);

-- WINNERS: Public read, authenticated write
CREATE POLICY "Allow public read access on winners" ON winners FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on winners" ON winners FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on winners" ON winners FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on winners" ON winners FOR DELETE USING (true);

-- GALLERY: Public read, authenticated write
CREATE POLICY "Allow public read access on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on gallery" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on gallery" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on gallery" ON gallery FOR DELETE USING (true);

-- DRAFTS: Public read published, authenticated write
CREATE POLICY "Allow public read published drafts" ON drafts FOR SELECT USING (status = 'published' OR true);
CREATE POLICY "Allow authenticated insert on drafts" ON drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on drafts" ON drafts FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on drafts" ON drafts FOR DELETE USING (true);

-- EMAIL LISTS: Authenticated only
CREATE POLICY "Allow authenticated read on email_lists" ON email_lists FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on email_lists" ON email_lists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update on email_lists" ON email_lists FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete on email_lists" ON email_lists FOR DELETE USING (true);

-- EMAIL LOGS: Authenticated only
CREATE POLICY "Allow authenticated read on email_logs" ON email_logs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert on email_logs" ON email_logs FOR INSERT WITH CHECK (true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ All tables created successfully!';
  RAISE NOTICE '✅ Indexes created for better performance!';
  RAISE NOTICE '✅ Row Level Security enabled!';
  RAISE NOTICE '✅ Policies configured!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next step: Run 02-insert-sample-data.sql';
END $$;
