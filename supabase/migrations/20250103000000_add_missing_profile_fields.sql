-- Migration: Add missing profile fields
-- Add columns that the profile form is trying to save but don't exist in the schema

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2) CHECK (weight_kg > 0),
ADD COLUMN IF NOT EXISTS fitness_goals TEXT CHECK (fitness_goals IN ('weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness')),
ADD COLUMN IF NOT EXISTS experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update existing records to populate full_name from first_name and last_name
UPDATE profiles 
SET full_name = COALESCE(first_name || ' ' || last_name, first_name, last_name)
WHERE full_name IS NULL AND (first_name IS NOT NULL OR last_name IS NOT NULL); 