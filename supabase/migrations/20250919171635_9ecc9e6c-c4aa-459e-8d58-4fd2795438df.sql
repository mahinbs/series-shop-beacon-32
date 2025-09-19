-- Create storage bucket for comic images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('comic-pages', 'comic-pages', true);

-- Create storage policies for comic pages
CREATE POLICY "Comic pages are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'comic-pages');

CREATE POLICY "Authenticated users can upload comic pages" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'comic-pages' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update comic pages" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'comic-pages' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete comic pages" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'comic-pages' AND auth.role() = 'authenticated');