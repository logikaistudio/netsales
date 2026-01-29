-- Add location_type column to prospects table
ALTER TABLE prospects 
ADD COLUMN IF NOT EXISTS location_type TEXT DEFAULT 'Residential';

-- Add comment to describe values
COMMENT ON COLUMN prospects.location_type IS 'Type of location: Residential, Apartment, Open Area, Industrial Park, Office Park';
