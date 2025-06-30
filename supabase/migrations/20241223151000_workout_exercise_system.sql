-- Migration: Workout & Exercise System
-- Ticket 1.2: Workout & Exercise Schema

-- Create muscle_groups table for exercise categorization
CREATE TABLE IF NOT EXISTS muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create equipment table for exercise requirements
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT, -- 'free_weights', 'machines', 'cardio', 'bodyweight', 'accessories'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create comprehensive exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT, -- Step-by-step instructions
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  exercise_type TEXT CHECK (exercise_type IN ('strength', 'cardio', 'flexibility', 'balance', 'plyometric')) DEFAULT 'strength',
  
  -- Muscle targeting
  primary_muscle_groups TEXT[], -- Array of muscle group names
  secondary_muscle_groups TEXT[], -- Secondary muscles worked
  
  -- Exercise mechanics
  movement_pattern TEXT, -- 'push', 'pull', 'squat', 'hinge', 'lunge', 'core', 'carry'
  equipment_needed TEXT[], -- Array of equipment names
  
  -- Media and resources
  demo_video_url TEXT,
  demo_image_url TEXT,
  tips TEXT, -- Performance tips
  
  -- Metadata
  is_compound BOOLEAN DEFAULT FALSE, -- Compound vs isolation exercise
  is_bilateral BOOLEAN DEFAULT TRUE, -- Both sides vs single side
  created_by UUID REFERENCES profiles(id), -- NULL for system exercises
  is_public BOOLEAN DEFAULT TRUE, -- Public vs private exercise
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create workout_templates table for reusable workout plans
CREATE TABLE IF NOT EXISTS workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  estimated_duration_minutes INTEGER CHECK (estimated_duration_minutes > 0),
  
  -- Categorization
  workout_type TEXT[], -- 'strength', 'cardio', 'flexibility', 'hiit', 'circuit'
  target_muscle_groups TEXT[], -- Primary muscle groups targeted
  equipment_needed TEXT[], -- Required equipment
  
  -- Template properties
  is_public BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  times_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create workout_template_exercises junction table
CREATE TABLE IF NOT EXISTS workout_template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  
  -- Exercise order and grouping
  order_index INTEGER NOT NULL, -- Order within workout
  superset_group INTEGER, -- NULL for regular sets, same number for superset
  
  -- Default set parameters (can be overridden in actual workouts)
  default_sets INTEGER CHECK (default_sets > 0),
  default_reps_min INTEGER CHECK (default_reps_min > 0),
  default_reps_max INTEGER CHECK (default_reps_max >= default_reps_min),
  default_weight_kg DECIMAL(6,2) CHECK (default_weight_kg >= 0),
  default_duration_seconds INTEGER CHECK (default_duration_seconds > 0),
  default_rest_seconds INTEGER CHECK (default_rest_seconds >= 0) DEFAULT 60,
  
  -- Exercise-specific notes
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_workouts table for actual workout sessions
CREATE TABLE IF NOT EXISTS user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES workout_templates(id), -- NULL for freestyle workouts
  
  -- Workout session details
  name TEXT NOT NULL,
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Session metrics
  total_duration_minutes INTEGER,
  total_volume_kg DECIMAL(10,2) DEFAULT 0, -- Total weight lifted
  total_reps INTEGER DEFAULT 0,
  estimated_calories_burned INTEGER,
  
  -- Session notes and rating
  notes TEXT,
  perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10), -- RPE scale
  session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
  
  -- Status tracking
  status TEXT CHECK (status IN ('planned', 'in_progress', 'completed', 'skipped')) DEFAULT 'planned',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create workout_exercises junction table for actual workout execution
CREATE TABLE IF NOT EXISTS workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES user_workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  
  -- Exercise order and grouping
  order_index INTEGER NOT NULL,
  superset_group INTEGER,
  
  -- Exercise completion status
  is_completed BOOLEAN DEFAULT FALSE,
  skipped_reason TEXT,
  
  -- Exercise notes
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create exercise_sets table for individual set tracking
CREATE TABLE IF NOT EXISTS exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  
  -- Set details
  set_number INTEGER NOT NULL CHECK (set_number > 0),
  set_type TEXT CHECK (set_type IN ('working', 'warmup', 'dropset', 'restpause', 'failure')) DEFAULT 'working',
  
  -- Performance metrics (nullable for different exercise types)
  reps INTEGER CHECK (reps >= 0),
  weight_kg DECIMAL(6,2) CHECK (weight_kg >= 0),
  duration_seconds INTEGER CHECK (duration_seconds >= 0),
  distance_meters DECIMAL(8,2) CHECK (distance_meters >= 0),
  rest_duration_seconds INTEGER CHECK (rest_duration_seconds >= 0),
  
  -- Set completion
  is_completed BOOLEAN DEFAULT FALSE,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
  
  -- Timestamps
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(exercise_type);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_public ON exercises(is_public);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON exercises USING GIN(primary_muscle_groups);

CREATE INDEX IF NOT EXISTS idx_workout_templates_user ON workout_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_workout_templates_public ON workout_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_workout_templates_type ON workout_templates USING GIN(workout_type);

CREATE INDEX IF NOT EXISTS idx_user_workouts_user_date ON user_workouts(user_id, workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_workouts_status ON user_workouts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_workouts_template ON user_workouts(template_id);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout ON workout_exercises(workout_id, order_index);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise ON exercise_sets(workout_exercise_id, set_number);

-- Add updated_at triggers
CREATE TRIGGER update_exercises_updated_at 
  BEFORE UPDATE ON exercises 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at 
  BEFORE UPDATE ON workout_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_workouts_updated_at 
  BEFORE UPDATE ON user_workouts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercises (public readable, only creators can modify custom exercises)
CREATE POLICY "Anyone can view public exercises" ON exercises
  FOR SELECT USING (is_public = true OR created_by = auth.uid() OR created_by IS NULL);

CREATE POLICY "Users can create custom exercises" ON exercises
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their custom exercises" ON exercises
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for workout templates
CREATE POLICY "Users can view public templates and their own" ON workout_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own templates" ON workout_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON workout_templates
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" ON workout_templates
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for workout template exercises
CREATE POLICY "Users can view template exercises they have access to" ON workout_template_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM workout_templates wt 
      WHERE wt.id = workout_template_id 
      AND (wt.is_public = true OR wt.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage their template exercises" ON workout_template_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_templates wt 
      WHERE wt.id = workout_template_id 
      AND wt.created_by = auth.uid()
    )
  );

-- RLS Policies for user workouts
CREATE POLICY "Users can manage their own workouts" ON user_workouts
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for workout exercises
CREATE POLICY "Users can manage their workout exercises" ON workout_exercises
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_workouts uw 
      WHERE uw.id = workout_id 
      AND uw.user_id = auth.uid()
    )
  );

-- RLS Policies for exercise sets
CREATE POLICY "Users can manage their exercise sets" ON exercise_sets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we 
      JOIN user_workouts uw ON uw.id = we.workout_id
      WHERE we.id = workout_exercise_id 
      AND uw.user_id = auth.uid()
    )
  );

-- Insert basic muscle groups
INSERT INTO muscle_groups (name, description) VALUES
('Chest', 'Pectoralis major and minor muscles'),
('Back', 'Latissimus dorsi, rhomboids, and trapezius'),
('Shoulders', 'Deltoid muscles (anterior, medial, posterior)'),
('Biceps', 'Biceps brachii and brachialis'),
('Triceps', 'Triceps brachii'),
('Forearms', 'Forearm flexors and extensors'),
('Abs', 'Rectus abdominis and obliques'),
('Core', 'Deep core stabilizing muscles'),
('Glutes', 'Gluteus maximus, medius, and minimus'),
('Quadriceps', 'Quadriceps femoris muscle group'),
('Hamstrings', 'Hamstring muscle group'),
('Calves', 'Gastrocnemius and soleus'),
('Full Body', 'Multiple muscle groups worked together')
ON CONFLICT (name) DO NOTHING;

-- Insert basic equipment
INSERT INTO equipment (name, description, category) VALUES
('Barbell', 'Olympic barbell for heavy lifting', 'free_weights'),
('Dumbbells', 'Adjustable or fixed weight dumbbells', 'free_weights'),
('Kettlebell', 'Cast iron or steel weights with handles', 'free_weights'),
('Pull-up Bar', 'Bar for pull-ups and chin-ups', 'bodyweight'),
('Resistance Bands', 'Elastic bands for resistance training', 'accessories'),
('Bench', 'Weight bench for pressing exercises', 'accessories'),
('Squat Rack', 'Safety rack for squatting', 'accessories'),
('Cable Machine', 'Pulley system for varied exercises', 'machines'),
('Treadmill', 'Cardio machine for running/walking', 'cardio'),
('Stationary Bike', 'Stationary bicycle for cardio', 'cardio'),
('Bodyweight', 'No equipment needed', 'bodyweight')
ON CONFLICT (name) DO NOTHING; 