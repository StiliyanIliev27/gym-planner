-- Migration: Add Sample Exercises
-- This migration adds basic exercises to populate the database for testing

-- Insert sample exercises with proper arrays for muscle groups and equipment
INSERT INTO exercises (
  name, 
  description, 
  instructions, 
  difficulty_level, 
  exercise_type,
  primary_muscle_groups,
  secondary_muscle_groups,
  movement_pattern,
  equipment_needed,
  is_compound,
  is_bilateral,
  is_public
) VALUES

-- Chest Exercises
('Push-ups', 
 'Classic bodyweight exercise for chest, shoulders, and triceps',
 'Start in plank position. Lower body until chest nearly touches ground. Push back up.',
 'beginner', 'strength',
 ARRAY['Chest'], ARRAY['Shoulders', 'Triceps'], 'push',
 ARRAY['Bodyweight'], true, true, true),

('Bench Press',
 'Fundamental barbell chest exercise',
 'Lie on bench. Lower barbell to chest. Press back up to starting position.',
 'intermediate', 'strength',
 ARRAY['Chest'], ARRAY['Shoulders', 'Triceps'], 'push',
 ARRAY['Barbell', 'Bench'], true, true, true),

('Dumbbell Flyes',
 'Isolation exercise for chest muscles',
 'Lie on bench with dumbbells. Lower weights in arc motion. Bring back together.',
 'intermediate', 'strength',
 ARRAY['Chest'], ARRAY[]::TEXT[], 'push',
 ARRAY['Dumbbells', 'Bench'], false, true, true),

-- Back Exercises
('Pull-ups',
 'Bodyweight exercise for back and biceps',
 'Hang from bar. Pull body up until chin clears bar. Lower with control.',
 'intermediate', 'strength',
 ARRAY['Back'], ARRAY['Biceps'], 'pull',
 ARRAY['Pull-up Bar'], true, true, true),

('Bent-over Rows',
 'Compound pulling exercise for back',
 'Bend over holding barbell. Pull weight to chest. Lower with control.',
 'intermediate', 'strength',
 ARRAY['Back'], ARRAY['Biceps'], 'pull',
 ARRAY['Barbell'], true, true, true),

('Lat Pulldowns',
 'Machine exercise targeting lats',
 'Sit at machine. Pull bar down to chest. Return with control.',
 'beginner', 'strength',
 ARRAY['Back'], ARRAY['Biceps'], 'pull',
 ARRAY['Cable Machine'], true, true, true),

-- Leg Exercises
('Squats',
 'Fundamental lower body exercise',
 'Stand with feet shoulder-width apart. Lower as if sitting. Stand back up.',
 'beginner', 'strength',
 ARRAY['Quadriceps'], ARRAY['Glutes', 'Hamstrings'], 'squat',
 ARRAY['Bodyweight'], true, true, true),

('Deadlifts',
 'Full body compound exercise',
 'Stand with barbell at feet. Bend and grip bar. Stand up lifting weight.',
 'advanced', 'strength',
 ARRAY['Hamstrings'], ARRAY['Back', 'Glutes'], 'hinge',
 ARRAY['Barbell'], true, true, true),

('Lunges',
 'Single-leg strength exercise',
 'Step forward into lunge position. Push back to starting position.',
 'beginner', 'strength',
 ARRAY['Quadriceps'], ARRAY['Glutes'], 'lunge',
 ARRAY['Bodyweight'], true, false, true),

-- Shoulder Exercises
('Overhead Press',
 'Standing shoulder press exercise',
 'Stand holding barbell at shoulders. Press overhead. Lower with control.',
 'intermediate', 'strength',
 ARRAY['Shoulders'], ARRAY['Triceps'], 'push',
 ARRAY['Barbell'], true, true, true),

('Lateral Raises',
 'Isolation exercise for side delts',
 'Hold dumbbells at sides. Raise out to shoulder height. Lower slowly.',
 'beginner', 'strength',
 ARRAY['Shoulders'], ARRAY[]::TEXT[], 'push',
 ARRAY['Dumbbells'], false, true, true),

-- Arm Exercises
('Bicep Curls',
 'Basic bicep isolation exercise',
 'Hold dumbbells with arms extended. Curl weights up. Lower slowly.',
 'beginner', 'strength',
 ARRAY['Biceps'], ARRAY[]::TEXT[], 'pull',
 ARRAY['Dumbbells'], false, true, true),

('Tricep Dips',
 'Bodyweight tricep exercise',
 'Support body on bench/chair. Lower body by bending arms. Push back up.',
 'intermediate', 'strength',
 ARRAY['Triceps'], ARRAY['Shoulders'], 'push',
 ARRAY['Bench'], true, true, true),

-- Core Exercises
('Plank',
 'Isometric core strengthening exercise',
 'Hold push-up position without moving. Keep body straight.',
 'beginner', 'strength',
 ARRAY['Core'], ARRAY['Abs'], 'core',
 ARRAY['Bodyweight'], true, true, true),

('Crunches',
 'Basic abdominal exercise',
 'Lie on back. Lift shoulders off ground. Lower with control.',
 'beginner', 'strength',
 ARRAY['Abs'], ARRAY[]::TEXT[], 'core',
 ARRAY['Bodyweight'], false, true, true),

-- Cardio Exercises
('Running',
 'Basic cardiovascular exercise',
 'Maintain steady pace for desired duration.',
 'beginner', 'cardio',
 ARRAY['Full Body'], ARRAY[]::TEXT[], 'carry',
 ARRAY['Treadmill'], true, true, true),

('Jumping Jacks',
 'Full body cardio exercise',
 'Jump feet apart while raising arms. Return to starting position.',
 'beginner', 'cardio',
 ARRAY['Full Body'], ARRAY[]::TEXT[], 'carry',
 ARRAY['Bodyweight'], true, true, true),

-- Full Body Exercises
('Burpees',
 'High-intensity full body exercise',
 'Drop to plank, do push-up, jump feet to hands, jump up with arms overhead.',
 'advanced', 'cardio',
 ARRAY['Full Body'], ARRAY[]::TEXT[], 'carry',
 ARRAY['Bodyweight'], true, true, true),

('Mountain Climbers',
 'Dynamic full body exercise',
 'Start in plank. Alternate bringing knees to chest rapidly.',
 'intermediate', 'cardio',
 ARRAY['Core'], ARRAY['Full Body'], 'core',
 ARRAY['Bodyweight'], true, false, true),

('Kettlebell Swings',
 'Dynamic hip hinge exercise',
 'Swing kettlebell from between legs to shoulder height using hip drive.',
 'intermediate', 'strength',
 ARRAY['Glutes'], ARRAY['Hamstrings', 'Core'], 'hinge',
 ARRAY['Kettlebell'], true, true, true); 