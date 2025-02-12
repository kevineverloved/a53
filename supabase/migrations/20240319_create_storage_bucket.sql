
-- Create a new storage bucket for traffic signs
INSERT INTO storage.buckets (id, name)
VALUES ('traffic_signs', 'traffic_signs')
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read traffic signs
CREATE POLICY "Public read access for traffic signs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'traffic_signs');

-- Allow authenticated users to upload traffic signs
CREATE POLICY "Authenticated users can upload traffic signs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'traffic_signs');
