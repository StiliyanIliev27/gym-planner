// Workout-related type definitions and schemas

/**
 * Exercise structure
 */
export const ExerciseSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  muscle_groups: 'string[]',
  equipment: 'string[]',
  difficulty: 'string',
  instructions: 'string[]',
  tips: 'string[]',
  image_url: 'string'
};

/**
 * Workout set structure
 */
export const WorkoutSetSchema = {
  id: 'string',
  exercise_id: 'string',
  sets: 'number',
  reps: 'number',
  weight: 'number',
  rest_time: 'number',
  notes: 'string'
};

/**
 * Workout structure
 */
export const WorkoutSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  duration: 'number',
  difficulty: 'string',
  workout_type: 'string',
  muscle_groups: 'string[]',
  sets: 'WorkoutSet[]',
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