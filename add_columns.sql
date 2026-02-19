-- Add lat/lng columns to shops table
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS lng double precision;

-- (Optional) Update existing rows with default values if needed
-- UPDATE public.shops SET lat = 37.498095, lng = 127.027610 WHERE lat IS NULL;
