-- Create storage bucket for retreat registration photos
insert into storage.buckets (id, name, public)
values ('retreat-photos', 'retreat-photos', true);

-- Allow anyone to upload photos (public form)
CREATE POLICY "Anyone can upload retreat photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'retreat-photos');

-- Allow public read access to photos
CREATE POLICY "Public read access for retreat photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'retreat-photos');