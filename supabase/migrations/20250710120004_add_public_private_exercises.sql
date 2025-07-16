-- Migration: Add public/private exercise functionality
-- This migration adds support for user-created exercises that can be public or private

-- Add new columns to exercises table
ALTER TABLE exercises 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing exercises to be system exercises
UPDATE exercises 
SET is_system = true, 
    is_public = true,
    created_at = NOW(),
    updated_at = NOW()
WHERE created_by IS NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON exercises(created_by);
CREATE INDEX IF NOT EXISTS idx_exercises_is_public ON exercises(is_public);
CREATE INDEX IF NOT EXISTS idx_exercises_is_system ON exercises(is_system);

-- Add RLS policies for exercises
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view system exercises and public exercises
CREATE POLICY "Users can view system and public exercises" ON exercises
FOR SELECT USING (
  is_system = true OR 
  is_public = true OR 
  created_by = auth.uid()
);

-- Policy: Users can insert their own exercises
CREATE POLICY "Users can create their own exercises" ON exercises
FOR INSERT WITH CHECK (created_by = auth.uid());

-- Policy: Users can update their own exercises
CREATE POLICY "Users can update their own exercises" ON exercises
FOR UPDATE USING (created_by = auth.uid());

-- Policy: Users can delete their own exercises (not system exercises)
CREATE POLICY "Users can delete their own exercises" ON exercises
FOR DELETE USING (created_by = auth.uid() AND is_system = false);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_exercises_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER exercises_updated_at_trigger
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_exercises_updated_at();

-- Add comments
COMMENT ON COLUMN exercises.created_by IS 'User who created this exercise (NULL for system exercises)';
COMMENT ON COLUMN exercises.is_public IS 'Whether the exercise is visible to all users';
COMMENT ON COLUMN exercises.is_system IS 'Whether this is a system/built-in exercise';
COMMENT ON COLUMN exercises.created_at IS 'When the exercise was created';
COMMENT ON COLUMN exercises.updated_at IS 'When the exercise was last updated'; 