-- Sample Photos for Gallery
-- Run this in your Supabase SQL Editor

-- Note: Replace the fest_id and event_id values with actual IDs from your database
-- First, check your fests table: SELECT * FROM fests;
-- Then, check your events table: SELECT * FROM events;

-- Example: If Sparx has id='fest-1' and Basketball event has id='event-1'

-- Sparx (Sports) Photos
INSERT INTO gallery (fest_id, event_id, title, description, image_url) VALUES
-- Replace 'your-sparx-fest-id' and 'your-event-id' with actual IDs
((SELECT id FROM fests WHERE name ILIKE '%sparx%' LIMIT 1), 
 (SELECT id FROM events WHERE name ILIKE '%basketball%' LIMIT 1),
 'Basketball Championship', 
 'Intense final match of the basketball tournament',
 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%sparx%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%cricket%' LIMIT 1),
 'Cricket Finals',
 'Thrilling cricket match moments',
 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%sparx%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%football%' LIMIT 1),
 'Football Tournament',
 'Action-packed football championship',
 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%sparx%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%athletics%' OR name ILIKE '%track%' LIMIT 1),
 'Athletics Meet',
 'Track and field events showcase',
 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800');

-- Spandan (Cultural) Photos
INSERT INTO gallery (fest_id, event_id, title, description, image_url) VALUES
((SELECT id FROM fests WHERE name ILIKE '%spandan%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%dance%' LIMIT 1),
 'Classical Dance Performance',
 'Mesmerizing traditional dance showcase',
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%spandan%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%music%' LIMIT 1),
 'Music Concert',
 'Live band performance at cultural night',
 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%spandan%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%drama%' OR name ILIKE '%theatre%' LIMIT 1),
 'Drama Competition',
 'Theatrical performances by talented students',
 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%spandan%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%fashion%' LIMIT 1),
 'Fashion Show',
 'Glamorous fashion show finale',
 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%spandan%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%art%' LIMIT 1),
 'Art Exhibition',
 'Student artwork and installations',
 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800');

-- Transmission (Technical) Photos
INSERT INTO gallery (fest_id, event_id, title, description, image_url) VALUES
((SELECT id FROM fests WHERE name ILIKE '%transmission%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%robot%' LIMIT 1),
 'Robotics Competition',
 'Advanced robotics showcase and battles',
 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%transmission%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%hack%' OR name ILIKE '%coding%' LIMIT 1),
 'Coding Hackathon',
 '24-hour coding marathon',
 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%transmission%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%exhibition%' OR name ILIKE '%expo%' LIMIT 1),
 'Tech Exhibition',
 'Innovative projects and prototypes',
 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%transmission%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%AI%' OR name ILIKE '%workshop%' LIMIT 1),
 'AI Workshop',
 'Machine learning and AI demonstrations',
 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%transmission%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%drone%' LIMIT 1),
 'Drone Racing',
 'High-speed drone competition',
 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'),

((SELECT id FROM fests WHERE name ILIKE '%transmission%' LIMIT 1),
 (SELECT id FROM events WHERE name ILIKE '%gaming%' OR name ILIKE '%esports%' LIMIT 1),
 'Gaming Tournament',
 'Esports championship finals',
 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800');
