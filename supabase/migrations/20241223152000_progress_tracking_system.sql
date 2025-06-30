-- Migration: Progress Tracking System
-- Ticket 1.3: Progress Tracking Schema

-- Create user_measurements table for tracking body metrics
CREATE TABLE IF NOT EXISTS user_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Measurement date and time
  measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
  measured_at TIMESTAMP DEFAULT NOW(),
  
  -- Body composition measurements
  weight_kg DECIMAL(5,2) CHECK (weight_kg > 0),
  body_fat_percentage DECIMAL(4,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
  muscle_mass_kg DECIMAL(5,2) CHECK (muscle_mass_kg >= 0),
  water_percentage DECIMAL(4,2) CHECK (water_percentage >= 0 AND water_percentage <= 100),
  bone_mass_kg DECIMAL(4,2) CHECK (bone_mass_kg >= 0),
  visceral_fat_rating INTEGER CHECK (visceral_fat_rating >= 1 AND visceral_fat_rating <= 60),
  
  -- Body measurements (in cm)
  neck_cm DECIMAL(4,1) CHECK (neck_cm > 0),
  chest_cm DECIMAL(4,1) CHECK (chest_cm > 0),
  waist_cm DECIMAL(4,1) CHECK (waist_cm > 0),
  hips_cm DECIMAL(4,1) CHECK (hips_cm > 0),
  bicep_left_cm DECIMAL(4,1) CHECK (bicep_left_cm > 0),
  bicep_right_cm DECIMAL(4,1) CHECK (bicep_right_cm > 0),
  thigh_left_cm DECIMAL(4,1) CHECK (thigh_left_cm > 0),
  thigh_right_cm DECIMAL(4,1) CHECK (thigh_right_cm > 0),
  calf_left_cm DECIMAL(4,1) CHECK (calf_left_cm > 0),
  calf_right_cm DECIMAL(4,1) CHECK (calf_right_cm > 0),
  
  -- Measurement context
  measurement_type TEXT CHECK (measurement_type IN ('manual', 'scale', 'dexa', 'bodpod', 'calipers')) DEFAULT 'manual',
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create progress_photos table for visual tracking
CREATE TABLE IF NOT EXISTS progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Photo details
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('front', 'back', 'side_left', 'side_right', 'custom')) NOT NULL,
  photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Associated measurement
  measurement_id UUID REFERENCES user_measurements(id),
  
  -- Photo metadata
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create achievement_definitions table for gamification
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Achievement details
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('workout', 'consistency', 'strength', 'endurance', 'weight_loss', 'muscle_gain', 'special')) NOT NULL,
  
  -- Achievement requirements
  requirement_type TEXT CHECK (requirement_type IN ('workout_count', 'consecutive_days', 'weight_lifted', 'distance_run', 'calories_burned', 'weight_lost', 'weight_gained', 'custom')) NOT NULL,
  requirement_value DECIMAL(10,2),
  requirement_timeframe_days INTEGER, -- NULL for all-time achievements
  
  -- Achievement properties
  points INTEGER DEFAULT 0,
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  icon_url TEXT,
  badge_color TEXT,
  
  -- Achievement status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_achievements table for earned achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
  
  -- Achievement progress and completion
  progress_value DECIMAL(10,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  
  -- Achievement context
  related_workout_id UUID REFERENCES user_workouts(id),
  related_measurement_id UUID REFERENCES user_measurements(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique achievements per user
  UNIQUE(user_id, achievement_id)
);

-- Create daily_stats table for comprehensive daily tracking
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Activity metrics
  steps_count INTEGER CHECK (steps_count >= 0) DEFAULT 0,
  calories_burned INTEGER CHECK (calories_burned >= 0) DEFAULT 0,
  active_minutes INTEGER CHECK (active_minutes >= 0) DEFAULT 0,
  distance_km DECIMAL(6,2) CHECK (distance_km >= 0) DEFAULT 0,
  
  -- Nutrition tracking
  calories_consumed INTEGER CHECK (calories_consumed >= 0),
  protein_grams DECIMAL(6,2) CHECK (protein_grams >= 0),
  carbs_grams DECIMAL(6,2) CHECK (carbs_grams >= 0),
  fat_grams DECIMAL(6,2) CHECK (fat_grams >= 0),
  fiber_grams DECIMAL(6,2) CHECK (fiber_grams >= 0),
  water_liters DECIMAL(4,2) CHECK (water_liters >= 0),
  
  -- Wellness metrics
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  
  -- Recovery metrics
  resting_heart_rate INTEGER CHECK (resting_heart_rate > 0),
  hrv_score INTEGER CHECK (hrv_score > 0), -- Heart Rate Variability
  recovery_score INTEGER CHECK (recovery_score >= 0 AND recovery_score <= 100),
  
  -- Workout summary
  workouts_completed INTEGER DEFAULT 0 CHECK (workouts_completed >= 0),
  total_workout_duration_minutes INTEGER DEFAULT 0 CHECK (total_workout_duration_minutes >= 0),
  
  -- Notes and tags
  notes TEXT,
  tags TEXT[], -- Array of custom tags
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure one record per user per date
  UNIQUE(user_id, date)
);

-- Create exercise_personal_records table for strength tracking
CREATE TABLE IF NOT EXISTS exercise_personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  
  -- Record types
  record_type TEXT CHECK (record_type IN ('1rm', '3rm', '5rm', 'max_reps', 'max_weight', 'max_volume', 'max_distance', 'max_duration')) NOT NULL,
  
  -- Record values
  weight_kg DECIMAL(6,2) CHECK (weight_kg >= 0),
  reps INTEGER CHECK (reps >= 0),
  duration_seconds INTEGER CHECK (duration_seconds >= 0),
  distance_meters DECIMAL(8,2) CHECK (distance_meters >= 0),
  volume_kg DECIMAL(10,2) CHECK (volume_kg >= 0), -- weight * reps
  
  -- Record context
  set_id UUID REFERENCES exercise_sets(id), -- The specific set that achieved this record
  workout_id UUID REFERENCES user_workouts(id), -- The workout where this was achieved
  achieved_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Record verification
  is_verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure unique record type per user per exercise
  UNIQUE(user_id, exercise_id, record_type)
);

-- Create progress_milestones table for goal tracking
CREATE TABLE IF NOT EXISTS progress_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES user_goals(id) ON DELETE CASCADE,
  
  -- Milestone details
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  metric_type TEXT CHECK (metric_type IN ('weight', 'body_fat', 'muscle_mass', 'strength', 'endurance', 'consistency', 'custom')) NOT NULL,
  
  -- Milestone timeline
  target_date DATE,
  achieved_date DATE,
  is_achieved BOOLEAN DEFAULT FALSE,
  
  -- Milestone properties
  priority INTEGER CHECK (priority >= 1 AND priority <= 5) DEFAULT 3,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_measurements_user_date ON user_measurements(user_id, measurement_date DESC);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_date ON progress_photos(user_id, photo_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_daily_stats_user_date ON daily_stats(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_personal_records_user ON exercise_personal_records(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_progress_milestones_user ON progress_milestones(user_id, is_active);

-- Add updated_at triggers
CREATE TRIGGER update_user_achievements_updated_at 
  BEFORE UPDATE ON user_achievements 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at 
  BEFORE UPDATE ON daily_stats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_milestones_updated_at 
  BEFORE UPDATE ON progress_milestones 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_measurements
CREATE POLICY "Users can manage their own measurements" ON user_measurements
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for progress_photos
CREATE POLICY "Users can manage their own photos" ON progress_photos
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for daily_stats
CREATE POLICY "Users can manage their own daily stats" ON daily_stats
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for exercise_personal_records
CREATE POLICY "Users can manage their own records" ON exercise_personal_records
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for progress_milestones
CREATE POLICY "Users can manage their own milestones" ON progress_milestones
  FOR ALL USING (user_id = auth.uid());

-- Public read access to achievement definitions
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view achievement definitions" ON achievement_definitions
  FOR SELECT USING (true);

-- Insert default achievement definitions
INSERT INTO achievement_definitions (name, description, category, requirement_type, requirement_value, points, rarity) VALUES
('First Workout', 'Complete your first workout session', 'workout', 'workout_count', 1, 10, 'common'),
('Consistent Week', 'Complete workouts for 7 consecutive days', 'consistency', 'consecutive_days', 7, 25, 'uncommon'),
('Month Strong', 'Complete 20 workouts in 30 days', 'consistency', 'workout_count', 20, 50, 'rare'),
('Iron Dedication', 'Complete 100 total workouts', 'workout', 'workout_count', 100, 100, 'epic'),
('Strength Milestone', 'Lift a total of 10,000 kg', 'strength', 'weight_lifted', 10000, 75, 'rare'),
('Endurance Warrior', 'Run a total distance of 100 km', 'endurance', 'distance_run', 100000, 75, 'rare'),
('Calorie Crusher', 'Burn 10,000 calories through exercise', 'workout', 'calories_burned', 10000, 60, 'uncommon'),
('Weight Loss Champion', 'Lose 5 kg from starting weight', 'weight_loss', 'weight_lost', 5, 100, 'epic'),
('Muscle Builder', 'Gain 2 kg of muscle mass', 'muscle_gain', 'weight_gained', 2, 80, 'rare'),
('Weekly Warrior', 'Complete your weekly workout goal', 'consistency', 'workout_count', 4, 20, 'common')
ON CONFLICT (name) DO NOTHING; 