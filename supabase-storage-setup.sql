-- Supabase Storage Setup for Gallery Images
-- Run this in your Supabase SQL Editor

-- Create the images bucket for gallery photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Set up RLS policies for the images bucket
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Images storage bucket created successfully!';
  RAISE NOTICE '✅ RLS policies configured!';
  RAISE NOTICE '✅ Ready for image uploads!';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Go to http://localhost:3000/admin/gallery';
  RAISE NOTICE '   2. Click "Add Photo" button';
  RAISE NOTICE '   3. Upload images from your device';
  RAISE NOTICE '   4. Images will be stored in Supabase Storage';
END $$;
