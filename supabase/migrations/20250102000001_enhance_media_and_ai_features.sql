-- Migration: Enhance media and AI features
-- Add better media support for exercises and workouts
-- Add AI-related fields for future integrations

-- Add workout image support to user_workouts
ALTER TABLE user_workouts 
ADD COLUMN cover_image_url TEXT,
ADD COLUMN ai_generated_notes TEXT,
ADD COLUMN ai_suggestions TEXT[],
ADD COLUMN difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
ADD COLUMN workout_tags TEXT[];

-- Enhance exercises table with more media fields and AI features
ALTER TABLE exercises 
ADD COLUMN video_urls TEXT[], -- Multiple videos (different angles, variations)
ADD COLUMN image_urls TEXT[], -- Multiple images (form, setup, etc.)
ADD COLUMN ai_difficulty_score DECIMAL(3,2) CHECK (ai_difficulty_score >= 0 AND ai_difficulty_score <= 10),
ADD COLUMN form_cues TEXT[], -- AI-generated form cues
ADD COLUMN common_mistakes TEXT[], -- Common mistakes to avoid
ADD COLUMN progressions TEXT[], -- Exercise progressions
ADD COLUMN regressions TEXT[], -- Exercise regressions
ADD COLUMN ai_tags TEXT[]; -- AI-generated tags for better categorization

-- Update existing single URL fields to be more descriptive (keep for backwards compatibility)
COMMENT ON COLUMN exercises.demo_video_url IS 'Primary demo video (deprecated, use video_urls array)';

-- Create storage buckets for media files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('exercise-media', 'exercise-media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('workout-covers', 'workout-covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for exercise media
CREATE POLICY "Anyone can view exercise media" ON storage.objects
  FOR SELECT USING (bucket_id = 'exercise-media');

CREATE POLICY "Authenticated users can upload exercise media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'exercise-media' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own exercise media" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'exercise-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own exercise media" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'exercise-media' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for workout covers
CREATE POLICY "Anyone can view workout covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'workout-covers');

CREATE POLICY "Authenticated users can upload workout covers" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'workout-covers' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own workout covers" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'workout-covers' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own workout covers" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'workout-covers' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_ai_tags ON exercises USING GIN(ai_tags);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty_score ON exercises(ai_difficulty_score);
CREATE INDEX IF NOT EXISTS idx_user_workouts_tags ON user_workouts USING GIN(workout_tags);
CREATE INDEX IF NOT EXISTS idx_user_workouts_difficulty ON user_workouts(difficulty_rating);

-- Add sample AI data to existing exercises (for demo purposes)
UPDATE exercises 
SET 
  form_cues = CASE 
    WHEN name ILIKE '%squat%' THEN ARRAY['Keep your chest up', 'Drive through your heels', 'Keep knees aligned with toes']
    WHEN name ILIKE '%push%' OR name ILIKE '%press%' THEN ARRAY['Engage your core', 'Control the descent', 'Full range of motion']
    WHEN name ILIKE '%pull%' OR name ILIKE '%row%' THEN ARRAY['Squeeze shoulder blades', 'Pull with your back, not arms', 'Keep shoulders down']
    ELSE ARRAY['Maintain proper form', 'Control the movement', 'Breathe consistently']
  END,
  common_mistakes = CASE 
    WHEN name ILIKE '%squat%' THEN ARRAY['Knees caving inward', 'Not going deep enough', 'Leaning too far forward']
    WHEN name ILIKE '%push%' OR name ILIKE '%press%' THEN ARRAY['Flaring elbows too wide', 'Bouncing off chest', 'Partial range of motion']
    WHEN name ILIKE '%pull%' OR name ILIKE '%row%' THEN ARRAY['Using too much momentum', 'Not squeezing at the top', 'Rounding the back']
    ELSE ARRAY['Using too much weight', 'Poor form', 'Rushing the movement']
  END,
  ai_difficulty_score = CASE
    WHEN difficulty_level = 'beginner' THEN ROUND((RANDOM() * 3 + 1)::numeric, 2)
    WHEN difficulty_level = 'intermediate' THEN ROUND((RANDOM() * 3 + 4)::numeric, 2)
    WHEN difficulty_level = 'advanced' THEN ROUND((RANDOM() * 3 + 7)::numeric, 2)
    ELSE ROUND((RANDOM() * 10)::numeric, 2)
  END
WHERE form_cues IS NULL;

-- Add sample workout tags for existing workouts
UPDATE user_workouts 
SET 
  workout_tags = CASE 
    WHEN name ILIKE '%strength%' OR name ILIKE '%weight%' THEN ARRAY['strength', 'muscle-building']
    WHEN name ILIKE '%cardio%' OR name ILIKE '%running%' THEN ARRAY['cardio', 'endurance']
    WHEN name ILIKE '%hiit%' THEN ARRAY['hiit', 'fat-loss', 'intense']
    WHEN name ILIKE '%yoga%' OR name ILIKE '%stretch%' THEN ARRAY['flexibility', 'recovery']
    ELSE ARRAY['general-fitness']
  END,
  difficulty_rating = CASE
    WHEN estimated_calories_burned > 400 THEN 4
    WHEN estimated_calories_burned > 250 THEN 3
    WHEN estimated_calories_burned > 150 THEN 2
    ELSE 1
  END
WHERE workout_tags IS NULL; 