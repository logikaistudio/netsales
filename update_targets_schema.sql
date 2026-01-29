-- Add occupancy and target columns to sub_areas table
-- This allows setting business targets directly on regions

ALTER TABLE sub_areas 
ADD COLUMN IF NOT EXISTS occupancy INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS target INTEGER DEFAULT 0;

-- Verify columns added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sub_areas';
