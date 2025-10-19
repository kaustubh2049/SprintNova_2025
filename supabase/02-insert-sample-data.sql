-- ============================================
-- XIE Student Council - Sample Data
-- Run this AFTER 01-create-tables.sql
-- ============================================

-- ============================================
-- 1. INSERT FESTS
-- ============================================
INSERT INTO fests (name, type, description, start_date, end_date) VALUES
('Sparx', 'sports', 'Annual sports festival showcasing athletic excellence and team spirit', '2024-11-01', '2024-11-03'),
('Spandan', 'cultural', 'Cultural extravaganza celebrating art, music, dance and creativity', '2024-12-01', '2024-12-03'),
('Transmission', 'technical', 'Technical fest featuring hackathons, robotics, and innovation', '2025-01-15', '2025-01-17')
ON CONFLICT DO NOTHING;

-- ============================================
-- 2. INSERT EVENTS
-- ============================================
INSERT INTO events (fest_id, name, description, event_date, venue) VALUES
-- Sparx Events (Sports)
((SELECT id FROM fests WHERE name = 'Sparx'), 'Basketball', 'Inter-class basketball tournament', '2024-11-01', 'Main Court'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Cricket', 'Cricket championship', '2024-11-01', 'Cricket Ground'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Football', 'Football league matches', '2024-11-02', 'Football Field'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Volleyball', 'Volleyball tournament', '2024-11-02', 'Volleyball Court'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Badminton', 'Singles and doubles badminton', '2024-11-03', 'Indoor Stadium'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Table Tennis', 'Table tennis championship', '2024-11-03', 'TT Hall'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Chess', 'Strategic chess competition', '2024-11-03', 'Seminar Hall'),
((SELECT id FROM fests WHERE name = 'Sparx'), 'Athletics', '100m, 200m, relay races', '2024-11-01', 'Track Field'),

-- Spandan Events (Cultural)
((SELECT id FROM fests WHERE name = 'Spandan'), 'Classical Dance', 'Bharatanatyam, Kathak performances', '2024-12-01', 'Auditorium'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Western Dance', 'Hip-hop, contemporary dance', '2024-12-01', 'Main Stage'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Solo Singing', 'Classical and light music', '2024-12-02', 'Music Room'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Group Singing', 'Choir and band performances', '2024-12-02', 'Auditorium'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Drama', 'One-act plays and skits', '2024-12-03', 'Theater'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Fashion Show', 'Theme-based fashion showcase', '2024-12-03', 'Main Stage'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Painting', 'Live painting competition', '2024-12-01', 'Art Gallery'),
((SELECT id FROM fests WHERE name = 'Spandan'), 'Photography', 'Photo exhibition and contest', '2024-12-02', 'Exhibition Hall'),

-- Transmission Events (Technical)
((SELECT id FROM fests WHERE name = 'Transmission'), 'Hackathon', '24-hour coding marathon', '2025-01-15', 'Computer Lab'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Robotics', 'Robot wars and automation', '2025-01-16', 'Workshop'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Web Development', 'Build a website challenge', '2025-01-15', 'Lab 1'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'AI/ML Workshop', 'Machine learning projects', '2025-01-16', 'Seminar Hall'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Circuit Design', 'Electronics circuit building', '2025-01-17', 'Electronics Lab'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Tech Quiz', 'Technology trivia competition', '2025-01-17', 'Auditorium'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Gaming', 'E-sports tournament', '2025-01-15', 'Gaming Zone'),
((SELECT id FROM fests WHERE name = 'Transmission'), 'Paper Presentation', 'Research paper showcase', '2025-01-16', 'Conference Hall')
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. INSERT SAMPLE WINNERS
-- ============================================
INSERT INTO winners (event_id, fest_id, student_name, class, department, medal, position) VALUES
-- Basketball Winners
((SELECT id FROM events WHERE name = 'Basketball'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Rahul Sharma', 'CSE 3A', 'Computer Science', 'gold', 1),
((SELECT id FROM events WHERE name = 'Basketball'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Priya Patel', 'CSE 3B', 'Computer Science', 'silver', 2),
((SELECT id FROM events WHERE name = 'Basketball'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Amit Kumar', 'ECE 3A', 'Electronics', 'bronze', 3),

-- Cricket Winners
((SELECT id FROM events WHERE name = 'Cricket'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Vikas Reddy', 'MECH 2A', 'Mechanical', 'gold', 1),
((SELECT id FROM events WHERE name = 'Cricket'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Sneha Singh', 'CSE 2B', 'Computer Science', 'silver', 2),
((SELECT id FROM events WHERE name = 'Cricket'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Arjun Nair', 'CIVIL 3A', 'Civil', 'bronze', 3),

-- Football Winners
((SELECT id FROM events WHERE name = 'Football'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Karthik Iyer', 'ECE 2A', 'Electronics', 'gold', 1),
((SELECT id FROM events WHERE name = 'Football'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Deepak Joshi', 'CSE 3A', 'Computer Science', 'silver', 2),
((SELECT id FROM events WHERE name = 'Football'), (SELECT id FROM fests WHERE name = 'Sparx'), 'Rohan Desai', 'MECH 3B', 'Mechanical', 'bronze', 3),

-- Classical Dance Winners
((SELECT id FROM events WHERE name = 'Classical Dance'), (SELECT id FROM fests WHERE name = 'Spandan'), 'Lakshmi Menon', 'CSE 2A', 'Computer Science', 'gold', 1),
((SELECT id FROM events WHERE name = 'Classical Dance'), (SELECT id FROM fests WHERE name = 'Spandan'), 'Anjali Rao', 'ECE 3B', 'Electronics', 'silver', 2),
((SELECT id FROM events WHERE name = 'Classical Dance'), (SELECT id FROM fests WHERE name = 'Spandan'), 'Divya Krishnan', 'CSE 3B', 'Computer Science', 'bronze', 3),

-- Solo Singing Winners
((SELECT id FROM events WHERE name = 'Solo Singing'), (SELECT id FROM fests WHERE name = 'Spandan'), 'Aditya Verma', 'MECH 2B', 'Mechanical', 'gold', 1),
((SELECT id FROM events WHERE name = 'Solo Singing'), (SELECT id FROM fests WHERE name = 'Spandan'), 'Neha Gupta', 'CSE 3A', 'Computer Science', 'silver', 2),
((SELECT id FROM events WHERE name = 'Solo Singing'), (SELECT id FROM fests WHERE name = 'Spandan'), 'Siddharth Pillai', 'ECE 2A', 'Electronics', 'bronze', 3),

-- Hackathon Winners
((SELECT id FROM events WHERE name = 'Hackathon'), (SELECT id FROM fests WHERE name = 'Transmission'), 'Akash Mehta', 'CSE 4A', 'Computer Science', 'gold', 1),
((SELECT id FROM events WHERE name = 'Hackathon'), (SELECT id FROM fests WHERE name = 'Transmission'), 'Pooja Shah', 'CSE 3B', 'Computer Science', 'silver', 2),
((SELECT id FROM events WHERE name = 'Hackathon'), (SELECT id FROM fests WHERE name = 'Transmission'), 'Varun Kapoor', 'CSE 3A', 'Computer Science', 'bronze', 3),

-- Robotics Winners
((SELECT id FROM events WHERE name = 'Robotics'), (SELECT id FROM fests WHERE name = 'Transmission'), 'Ravi Shankar', 'ECE 4A', 'Electronics', 'gold', 1),
((SELECT id FROM events WHERE name = 'Robotics'), (SELECT id FROM fests WHERE name = 'Transmission'), 'Kavya Nambiar', 'ECE 3A', 'Electronics', 'silver', 2),
((SELECT id FROM events WHERE name = 'Robotics'), (SELECT id FROM fests WHERE name = 'Transmission'), 'Suresh Babu', 'MECH 3A', 'Mechanical', 'bronze', 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. INSERT SAMPLE GALLERY PHOTOS
-- ============================================
INSERT INTO gallery (fest_id, event_id, title, description, image_url) VALUES
-- Sparx Photos
((SELECT id FROM fests WHERE name = 'Sparx'), (SELECT id FROM events WHERE name = 'Basketball'), 'Basketball Championship Finals', 'Intense final match of the basketball tournament', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'),
((SELECT id FROM fests WHERE name = 'Sparx'), (SELECT id FROM events WHERE name = 'Cricket'), 'Cricket Finals Action', 'Thrilling moments from the cricket championship', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'),
((SELECT id FROM fests WHERE name = 'Sparx'), (SELECT id FROM events WHERE name = 'Football'), 'Football League Highlights', 'Best moments from the football matches', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'),
((SELECT id FROM fests WHERE name = 'Sparx'), (SELECT id FROM events WHERE name = 'Athletics'), 'Track and Field Events', 'Athletes competing in 100m and relay races', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800'),

-- Spandan Photos
((SELECT id FROM fests WHERE name = 'Spandan'), (SELECT id FROM events WHERE name = 'Classical Dance'), 'Classical Dance Performance', 'Beautiful Bharatanatyam and Kathak performances', 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=800'),
((SELECT id FROM fests WHERE name = 'Spandan'), (SELECT id FROM events WHERE name = 'Western Dance'), 'Western Dance Showcase', 'Energetic hip-hop and contemporary performances', 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800'),
((SELECT id FROM fests WHERE name = 'Spandan'), (SELECT id FROM events WHERE name = 'Solo Singing'), 'Solo Singing Competition', 'Melodious voices filling the auditorium', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'),
((SELECT id FROM fests WHERE name = 'Spandan'), (SELECT id FROM events WHERE name = 'Drama'), 'Drama Performance', 'Captivating one-act plays and skits', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'),

-- Transmission Photos
((SELECT id FROM fests WHERE name = 'Transmission'), (SELECT id FROM events WHERE name = 'Hackathon'), 'Hackathon in Progress', 'Students coding through the night', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800'),
((SELECT id FROM fests WHERE name = 'Transmission'), (SELECT id FROM events WHERE name = 'Robotics'), 'Robot Wars Competition', 'Exciting robot battles and demonstrations', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'),
((SELECT id FROM fests WHERE name = 'Transmission'), (SELECT id FROM events WHERE name = 'AI/ML Workshop'), 'AI/ML Workshop Session', 'Students learning machine learning concepts', 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800'),
((SELECT id FROM fests WHERE name = 'Transmission'), (SELECT id FROM events WHERE name = 'Gaming'), 'E-Sports Tournament', 'Competitive gaming action', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. INSERT SAMPLE NOTICES/DRAFTS
-- ============================================
INSERT INTO drafts (title, content, status, published_at) VALUES
('Welcome to New Academic Year 2024-25', 'Dear Students, We are excited to welcome you to the new academic year! This year promises to be filled with exciting events, competitions, and learning opportunities. Stay tuned for updates from the Student Council.', 'published', NOW() - INTERVAL '30 days'),
('Sparx 2024 - Sports Festival Announcement', 'Get ready for Sparx 2024! Our annual sports festival will be held from November 1-3. Registrations are now open for all events including Basketball, Cricket, Football, and more. Visit the sports office to register.', 'published', NOW() - INTERVAL '25 days'),
('Spandan Cultural Fest - Call for Participants', 'Calling all artists, dancers, singers, and performers! Spandan 2024 is here. Show your talent in our cultural extravaganza happening December 1-3. Multiple categories available. Register before November 25th.', 'published', NOW() - INTERVAL '20 days'),
('Transmission Tech Fest - Hackathon Registration Open', 'Attention tech enthusiasts! Transmission 2025 is coming. Our flagship event, the 24-hour Hackathon, is now open for registration. Form teams of 3-4 members. Limited slots available!', 'published', NOW() - INTERVAL '15 days'),
('Mid-Semester Exam Schedule Released', 'The mid-semester examination schedule has been published. Please check the notice board and college website for your exam timetable. All the best for your preparations!', 'published', NOW() - INTERVAL '10 days'),
('Library Extended Hours During Exams', 'The college library will remain open until 10 PM during the examination period. Students can utilize the extended hours for their studies. Please maintain silence in the library.', 'published', NOW() - INTERVAL '8 days'),
('Workshop on Resume Building - Career Cell', 'The Career Development Cell is organizing a workshop on Resume Building and Interview Skills on November 20th. Industry experts will guide you. Registration link in bio.', 'published', NOW() - INTERVAL '5 days'),
('Blood Donation Camp - NSS Activity', 'NSS is organizing a Blood Donation Camp on November 25th in collaboration with the District Hospital. Students above 18 years can participate. Save lives, donate blood!', 'published', NOW() - INTERVAL '3 days'),
('Inter-College Debate Competition', 'Our college is hosting an Inter-College Debate Competition on December 5th. Topics will be announced soon. Interested students can register with the English Department.', 'published', NOW() - INTERVAL '2 days'),
('Placement Drive - Tech Companies', 'Major tech companies will be visiting campus for placements in January 2025. Eligible students should update their resumes and prepare for aptitude tests. Details will be shared by the Placement Cell.', 'published', NOW() - INTERVAL '1 day'),
('Fest Winners Announcement - Sparx 2024', 'Congratulations to all winners of Sparx 2024! The complete list of winners and medal tally is now available on the college website. Certificates will be distributed next week.', 'published', NOW()),
('Upcoming Events - December 2024', 'Mark your calendars! December is packed with events - Spandan Cultural Fest (Dec 1-3), Alumni Meet (Dec 10), and Year-End Celebration (Dec 20). Stay connected for more updates!', 'published', NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. INSERT SAMPLE EMAIL LISTS
-- ============================================
INSERT INTO email_lists (name, description, emails) VALUES
('Student Council', 'All student council members', ARRAY['president@xie.edu', 'vicepresident@xie.edu', 'secretary@xie.edu', 'treasurer@xie.edu']),
('Faculty Coordinators', 'Faculty coordinators for events', ARRAY['sports@xie.edu', 'cultural@xie.edu', 'technical@xie.edu', 'hod.cse@xie.edu']),
('Class Representatives', 'All class representatives', ARRAY['cr.cse3a@xie.edu', 'cr.cse3b@xie.edu', 'cr.ece3a@xie.edu', 'cr.mech3a@xie.edu'])
ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
DECLARE
  fest_count INTEGER;
  event_count INTEGER;
  winner_count INTEGER;
  gallery_count INTEGER;
  draft_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO fest_count FROM fests;
  SELECT COUNT(*) INTO event_count FROM events;
  SELECT COUNT(*) INTO winner_count FROM winners;
  SELECT COUNT(*) INTO gallery_count FROM gallery;
  SELECT COUNT(*) INTO draft_count FROM drafts;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Sample data inserted successfully!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '📊 Data Summary:';
  RAISE NOTICE '   • Fests: %', fest_count;
  RAISE NOTICE '   • Events: %', event_count;
  RAISE NOTICE '   • Winners: %', winner_count;
  RAISE NOTICE '   • Gallery Photos: %', gallery_count;
  RAISE NOTICE '   • Notices: %', draft_count;
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your database is ready!';
  RAISE NOTICE '🚀 You can now use the admin panel to manage data';
  RAISE NOTICE '📱 Visit http://localhost:3000 to see your website';
END $$;
