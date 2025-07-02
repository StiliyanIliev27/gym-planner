// Workout-related type definitions and schemas

/**
 * Exercise structure
 */
export const ExerciseSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  primary_muscle_groups: 'string[]',
  secondary_muscle_groups: 'string[]',
  equipment_needed: 'string[]',
  difficulty_level: 'string',
  exercise_type: 'string',
  instructions: 'string',
  tips: 'string',
  demo_video_url: 'string',
  demo_image_url: 'string'
};

/**
 * Workout set structure
 */
export const WorkoutSetSchema = {
  id: 'string',
  workout_exercise_id: 'string',
  set_number: 'number',
  reps: 'number',
  weight_kg: 'number',
  duration_seconds: 'number',
  rest_duration_seconds: 'number',
  rpe: 'number',
  is_completed: 'boolean'
};

/**
 * Workout structure
 */
export const WorkoutSchema = {
  id: 'string',
  user_id: 'string',
  name: 'string',
  workout_date: 'string',
  total_duration_minutes: 'number',
  status: 'string',
  target_muscle_groups: 'string[]',
  notes: 'string',
  workout_exercises: 'WorkoutExercise[]',
  created_at: 'string',
  updated_at: 'string'
};

/**
 * Assessment data structure
 */
export const AssessmentDataSchema = {
  basicInfo: {
    age: 'number',
    gender: 'string',
    height: 'number',
    weight: 'number',
    activityLevel: 'string'
  },
  fitnessGoals: {
    primaryGoal: 'string',
    secondaryGoals: 'string[]',
    targetTimeframe: 'string'
  },
  experienceLevel: {
    overallExperience: 'string',
    strengthTraining: 'string',
    cardioExperience: 'string'
  },
  equipment: {
    gymAccess: 'boolean',
    homeEquipment: 'string[]',
    preferences: 'string[]'
  },
  healthLimitations: {
    injuries: 'string[]',
    limitations: 'string[]',
    medicalConditions: 'string[]'
  }
}; 