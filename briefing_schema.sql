-- Create the Briefing Submissions Table
CREATE TABLE IF NOT EXISTS public.infinity_briefing_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    briefing_type TEXT NOT NULL,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Policy to allow inserts (assuming anonymous submissions are allowed via API)
-- In a real production setup, depending on the role, RLS can be adjusted.
ALTER TABLE public.infinity_briefing_submissions ENABLE ROW LEVEL SECURITY;

-- Allow insert by anon/authenticated (the Next.js API handles logic)
CREATE POLICY "Allow public insert to infinity_briefing_submissions" 
ON public.infinity_briefing_submissions 
FOR INSERT 
TO public
WITH CHECK (true);

-- Allow read access for authenticated users (Admin Dashboard)
CREATE POLICY "Allow admin read access on infinity_briefing_submissions" 
ON public.infinity_briefing_submissions 
FOR SELECT 
TO authenticated 
USING (true);

-- Allow update access for authenticated users (Admin changing status)
CREATE POLICY "Allow admin update access on infinity_briefing_submissions" 
ON public.infinity_briefing_submissions 
FOR UPDATE 
TO authenticated 
USING (true);
