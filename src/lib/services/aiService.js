// AI Service for workout suggestions and personalized recommendations
// Currently using mock data - can be easily replaced with real AI provider later (Gemini, OpenAI, etc.)

/**
 * Generate workout suggestions based on user data and current workout
 * @param {Object} workoutData - Current workout data
 * @param {Object} userProfile - User profile data
 * @returns {Promise<{suggestions: Array, error: Error|null}>}
 */
export const generateWorkoutSuggestions = async (workoutData, userProfile = {}) => {
  try {
    // Mock AI suggestions - analyzing workout data and providing intelligent suggestions
    const suggestions = [];
    
    // Analyze exercise count
    const exerciseCount = workoutData.workout_exercises?.length || 0;
    if (exerciseCount < 3) {
      suggestions.push({
        type: "exercise_addition",
        title: "Add More Exercises",
        description: "Your workout has only a few exercises. Consider adding 2-3 more for a complete session.",
        priority: "high",
        actionable: true,
        icon: "Plus"
      });
    }

    // Check muscle group balance
    const muscleGroups = workoutData.workout_exercises?.map(we => 
      we.exercises?.primary_muscle_groups?.[0]
    ).filter(Boolean) || [];
    
    const uniqueMuscleGroups = [...new Set(muscleGroups)];
    if (uniqueMuscleGroups.length < 2) {
      suggestions.push({
        type: "muscle_balance",
        title: "Balance Muscle Groups",
        description: "Include exercises targeting different muscle groups for balanced development.",
        priority: "high",
        actionable: true,
        icon: "Target"
      });
    }

    // Check workout duration
    if (!workoutData.total_duration_minutes && exerciseCount > 0) {
      suggestions.push({
        type: "timing",
        title: "Set Workout Duration",
        description: "Planning your workout duration helps maintain focus and achieve better results.",
        priority: "medium",
        actionable: true,
        icon: "Clock"
      });
    }

    // Suggest based on workout status
    if (workoutData.status === 'planned') {
      suggestions.push({
        type: "preparation",
        title: "Pre-Workout Preparation",
        description: "Do a 5-10 minute warm-up before starting your main exercises.",
        priority: "medium",
        actionable: true,
        icon: "Flame"
      });
    }

    // Rest day suggestion
    const lastWorkoutDate = new Date(workoutData.workout_date);
    const today = new Date();
    const daysDiff = Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      suggestions.push({
        type: "recovery",
        title: "Recovery Focus",
        description: "Consider adding stretching or light cardio for active recovery between intense sessions.",
        priority: "low",
        actionable: true,
        icon: "Heart"
      });
    }

    // Add progression suggestions
    if (workoutData.status === 'completed') {
      suggestions.push({
        type: "progression",
        title: "Progressive Overload",
        description: "For your next workout, try increasing weight by 2.5-5% or adding 1-2 more reps.",
        priority: "medium",
        actionable: true,
        icon: "TrendingUp"
      });
    }

    return { suggestions, error: null };

  } catch (error) {
    console.error('Error generating workout suggestions:', error);
    return { suggestions: [], error };
  }
};

/**
 * Get exercise form tips and alternatives
 * @param {Object} exercise - Exercise data
 * @returns {Promise<{tips: Object, error: Error|null}>}
 */
export const getExerciseTips = async (exercise) => {
  try {
    // Mock AI-generated tips based on exercise analysis
    const tips = {
      form_tips: exercise.form_cues || getDefaultFormTips(exercise.name),
      common_mistakes: exercise.common_mistakes || getDefaultMistakes(exercise.name),
      alternatives: getAlternativeExercises(exercise.name, exercise.primary_muscle_groups),
      progressions: getProgressions(exercise.name),
      safety_notes: getSafetyNotes(exercise.primary_muscle_groups)
    };

    return { tips, error: null };

  } catch (error) {
    console.error('Error getting exercise tips:', error);
    return { tips: null, error };
  }
};

/**
 * Generate personalized workout plan (mock implementation)
 * @param {Object} userProfile - User profile and preferences
 * @param {Object} goals - Specific goals and constraints
 * @returns {Promise<{plan: Object, error: Error|null}>}
 */
export const generateWorkoutPlan = async (userProfile, goals = {}) => {
  try {
    // Mock AI-generated workout plan
    const plan = {
      name: `${goals.primary_goal || 'Fitness'} Plan`,
      description: `Personalized ${goals.days_per_week || 3}-day workout plan for ${userProfile.experience_level || 'beginner'} level`,
      duration_weeks: 4,
      workouts: [
        {
          day: "Monday",
          focus: "Upper Body",
          exercises: ["Push-ups", "Pull-ups", "Dumbbell Press"],
          estimated_duration: goals.duration_minutes || 45
        },
        {
          day: "Wednesday", 
          focus: "Lower Body",
          exercises: ["Squats", "Lunges", "Deadlifts"],
          estimated_duration: goals.duration_minutes || 45
        },
        {
          day: "Friday",
          focus: "Full Body",
          exercises: ["Burpees", "Mountain Climbers", "Plank"],
          estimated_duration: goals.duration_minutes || 45
        }
      ],
      progression_notes: "Increase weight by 2.5-5% each week or add 1-2 reps",
      recovery_tips: "Take rest days between workouts and get adequate sleep"
    };

    return { plan, error: null };

  } catch (error) {
    console.error('Error generating workout plan:', error);
    return { plan: null, error };
  }
};

/**
 * Analyze workout performance and provide insights
 * @param {Array} workoutHistory - Array of completed workouts
 * @returns {Promise<{insights: Object, error: Error|null}>}
 */
export const analyzeWorkoutPerformance = async (workoutHistory) => {
  try {
    const completedWorkouts = workoutHistory.filter(w => w.status === 'completed');
    const totalWorkouts = workoutHistory.length;
    const consistencyScore = Math.round((completedWorkouts.length / totalWorkouts) * 100);

    // Calculate trends
    const avgDuration = completedWorkouts.reduce((sum, w) => sum + (w.total_duration_minutes || 0), 0) / completedWorkouts.length;
    const avgExercises = completedWorkouts.reduce((sum, w) => sum + (w.workout_exercises?.length || 0), 0) / completedWorkouts.length;

    const insights = {
      trends: [
        `Average workout duration: ${Math.round(avgDuration || 0)} minutes`,
        `Average exercises per workout: ${Math.round(avgExercises || 0)}`,
        `Workout completion rate: ${consistencyScore}%`
      ],
      strengths: getStrengths(workoutHistory),
      areas_for_improvement: getImprovementAreas(workoutHistory),
      recommendations: getRecommendations(workoutHistory),
      consistency_score: consistencyScore,
      progress_indicators: getProgressIndicators(workoutHistory)
    };

    return { insights, error: null };

  } catch (error) {
    console.error('Error analyzing workout performance:', error);
    return { insights: null, error };
  }
};

/**
 * Get quick motivational message based on workout status
 * @param {Object} workout - Current workout data
 * @returns {string} Motivational message
 */
export const getMotivationalMessage = (workout) => {
  const messages = {
    planned: [
      "Ready to crush this workout? Let's go! 💪",
      "Your future self will thank you for starting today!",
      "Every rep counts - you've got this!",
      "Transform your goals into achievements, one workout at a time!"
    ],
    in_progress: [
      "Keep pushing - you're already halfway there! 🔥",
      "Feel the burn? That's growth happening!",
      "You're stronger than you think - prove it!",
      "Excellence is not a skill, it's an attitude!"
    ],
    completed: [
      "Workout completed! You're a champion! 🏆",
      "Another day, another victory! Well done!",
      "You showed up and gave your best - that's what matters!",
      "Progress isn't always perfect, but it's always worth it!"
    ],
    skipped: [
      "Tomorrow is a new opportunity to shine! ✨",
      "Rest when needed, but remember your goals!",
      "Every setback is a setup for a comeback!",
      "Listen to your body, but don't let excuses win!"
    ]
  };

  const statusMessages = messages[workout.status] || messages.planned;
  return statusMessages[Math.floor(Math.random() * statusMessages.length)];
};

// Helper functions for mock AI intelligence
const getDefaultFormTips = (exerciseName) => {
  const name = exerciseName.toLowerCase();
  if (name.includes('squat')) {
    return ['Keep your chest up', 'Drive through your heels', 'Keep knees aligned with toes'];
  } else if (name.includes('push') || name.includes('press')) {
    return ['Engage your core', 'Control the descent', 'Full range of motion'];
  } else if (name.includes('pull') || name.includes('row')) {
    return ['Squeeze shoulder blades', 'Pull with your back, not arms', 'Keep shoulders down'];
  }
  return ['Maintain proper form', 'Control the movement', 'Breathe consistently'];
};

const getDefaultMistakes = (exerciseName) => {
  const name = exerciseName.toLowerCase();
  if (name.includes('squat')) {
    return ['Knees caving inward', 'Not going deep enough', 'Leaning too far forward'];
  } else if (name.includes('push') || name.includes('press')) {
    return ['Flaring elbows too wide', 'Bouncing off chest', 'Partial range of motion'];
  }
  return ['Using too much weight', 'Poor form', 'Rushing the movement'];
};

const getAlternativeExercises = (exerciseName, muscleGroups) => {
  const primary = muscleGroups?.[0]?.toLowerCase() || '';
  if (primary.includes('chest')) {
    return ['Push-ups', 'Dumbbell Press', 'Chest Flyes'];
  } else if (primary.includes('back')) {
    return ['Pull-ups', 'Lat Pulldown', 'Seated Row'];
  } else if (primary.includes('leg')) {
    return ['Lunges', 'Leg Press', 'Goblet Squats'];
  }
  return ['Bodyweight variation', 'Resistance band version', 'Machine alternative'];
};

const getProgressions = (exerciseName) => {
  return ['Start with bodyweight version', 'Use resistance bands', 'Add weight gradually', 'Increase reps/sets'];
};

const getSafetyNotes = (muscleGroups) => {
  return ['Warm up properly', 'Start with lighter weights', 'Focus on form over weight', 'Listen to your body'];
};

const getStrengths = (workoutHistory) => {
  const strengths = [];
  const completionRate = workoutHistory.filter(w => w.status === 'completed').length / workoutHistory.length;
  
  if (completionRate > 0.8) {
    strengths.push('Excellent workout consistency');
  }
  if (workoutHistory.some(w => w.workout_exercises?.length > 5)) {
    strengths.push('Comprehensive workout structure');
  }
  if (workoutHistory.some(w => w.total_duration_minutes > 45)) {
    strengths.push('Good workout duration');
  }
  
  return strengths.length > 0 ? strengths : ['Building healthy habits'];
};

const getImprovementAreas = (workoutHistory) => {
  const areas = [];
  const completionRate = workoutHistory.filter(w => w.status === 'completed').length / workoutHistory.length;
  
  if (completionRate < 0.7) {
    areas.push('Improve workout consistency');
  }
  if (workoutHistory.every(w => (w.workout_exercises?.length || 0) < 4)) {
    areas.push('Add more exercises for variety');
  }
  if (workoutHistory.every(w => !w.total_duration_minutes)) {
    areas.push('Track workout duration');
  }
  
  return areas.length > 0 ? areas : ['Continue current progress'];
};

const getRecommendations = (workoutHistory) => {
  return [
    'Track your progress consistently',
    'Gradually increase workout intensity',
    'Include rest days for recovery',
    'Focus on proper form and technique'
  ];
};

const getProgressIndicators = (workoutHistory) => {
  const indicators = [];
  const recentWorkouts = workoutHistory.slice(-5);
  
  if (recentWorkouts.length > 0) {
    indicators.push(`${recentWorkouts.length} workouts in recent history`);
  }
  
  const avgExercises = recentWorkouts.reduce((sum, w) => sum + (w.workout_exercises?.length || 0), 0) / recentWorkouts.length;
  if (avgExercises > 0) {
    indicators.push(`Average ${Math.round(avgExercises)} exercises per workout`);
  }
  
  return indicators.length > 0 ? indicators : ['Getting started on fitness journey'];
}; 