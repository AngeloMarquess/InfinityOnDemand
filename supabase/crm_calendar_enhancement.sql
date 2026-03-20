-- Add event_type, location, and participants to crm_calendar_events
ALTER TABLE public.crm_calendar_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'reuniao';
ALTER TABLE public.crm_calendar_events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.crm_calendar_events ADD COLUMN IF NOT EXISTS participants TEXT[];  -- array of contact IDs
