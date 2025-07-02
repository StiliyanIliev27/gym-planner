import { supabase } from '../supabase/client';

/**
 * Workout Service - Handles all workout-related database operations
 * Includes workouts, templates, exercises, and sets tracking
 */

/**
 * Gets user workouts for a date range
 * @param {string} userId - The user ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserWorkouts = async (userId, startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('user_workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (
            name,
            primary_muscle_groups,
            equipment_needed,
            form_cues,
            common_mistakes,
            ai_difficulty_score
          ),
          exercise_sets (*)
        )
      `)
      .eq('user_id', userId)
      .gte('workout_date', startDate)
      .lte('workout_date', endDate)
      .order('workout_date', { ascending: false });

    if (error) {
      console.error('Error fetching user workouts:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserWorkouts:', error);
    return { data: null, error };
  }
};

/**
 * Gets a specific workout by ID
 * @param {number} workoutId - The workout ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getWorkoutById = async (workoutId) => {
  try {
    const { data, error } = await supabase
      .from('user_workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (
            name,
            primary_muscle_groups,
            secondary_muscle_groups,
            equipment_needed,
            instructions,
            demo_video_url,
            demo_image_url,
            video_urls,
            image_urls,
            form_cues,
            common_mistakes,
            progressions,
            regressions,
            ai_difficulty_score,
            difficulty_level,
            exercise_type
          ),
          exercise_sets (*)
        )
      `)
      .eq('id', workoutId)
      .single();

    if (error) {
      console.error('Error fetching workout by ID:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getWorkoutById:', error);
    return { data: null, error };
  }
};

/**
 * Creates a new workout
 * @param {string} userId - The user ID
 * @param {Object} workoutData - Workout data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createWorkout = async (userId, workoutData) => {
  try {
    const { data, error } = await supabase
      .from('user_workouts')
      .insert({
        user_id: userId,
        ...workoutData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workout:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createWorkout:', error);
    return { data: null, error };
  }
};

/**
 * Updates a workout
 * @param {number} workoutId - The workout ID
 * @param {Object} workoutData - Workout data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const { data, error } = await supabase
      .from('user_workouts')
      .update(workoutData)
      .eq('id', workoutId)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateWorkout:', error);
    return { data: null, error };
  }
};

/**
 * Deletes a workout
 * @param {number} workoutId - The workout ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteWorkout = async (workoutId) => {
  try {
    const { data, error } = await supabase
      .from('user_workouts')
      .delete()
      .eq('id', workoutId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting workout:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in deleteWorkout:', error);
    return { data: null, error };
  }
};

/**
 * Adds exercise to workout
 * @param {number} workoutId - The workout ID
 * @param {number} exerciseId - The exercise ID
 * @param {Object} exerciseData - Exercise data (order, notes, etc.)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const addExerciseToWorkout = async (workoutId, exerciseId, exerciseData = {}) => {
  try {
    const { data, error } = await supabase
      .from('workout_exercises')
      .insert({
        workout_id: workoutId,
        exercise_id: exerciseId,
        ...exerciseData
      })
      .select(`
        *,
        exercises (
          name,
          primary_muscle_groups,
          equipment_needed
        )
      `)
      .single();

    if (error) {
      console.error('Error adding exercise to workout:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in addExerciseToWorkout:', error);
    return { data: null, error };
  }
};

/**
 * Removes exercise from workout
 * @param {number} workoutExerciseId - The workout exercise ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const removeExerciseFromWorkout = async (workoutExerciseId) => {
  try {
    const { data, error } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('id', workoutExerciseId)
      .select()
      .single();

    if (error) {
      console.error('Error removing exercise from workout:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in removeExerciseFromWorkout:', error);
    return { data: null, error };
  }
};

/**
 * Adds set to workout exercise
 * @param {number} workoutExerciseId - The workout exercise ID
 * @param {Object} setData - Set data (reps, weight, etc.)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const addSetToExercise = async (workoutExerciseId, setData) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sets')
      .insert({
        workout_exercise_id: workoutExerciseId,
        ...setData
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding set to exercise:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in addSetToExercise:', error);
    return { data: null, error };
  }
};

/**
 * Updates exercise set
 * @param {number} setId - The set ID
 * @param {Object} setData - Set data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateExerciseSet = async (setId, setData) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sets')
      .update(setData)
      .eq('id', setId)
      .select()
      .single();

    if (error) {
      console.error('Error updating exercise set:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateExerciseSet:', error);
    return { data: null, error };
  }
};

/**
 * Deletes exercise set
 * @param {number} setId - The set ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteExerciseSet = async (setId) => {
  try {
    const { data, error } = await supabase
      .from('exercise_sets')
      .delete()
      .eq('id', setId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting exercise set:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in deleteExerciseSet:', error);
    return { data: null, error };
  }
};

/**
 * Gets workout templates for user
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getWorkoutTemplates = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates')
      .select(`
        *,
        workout_template_exercises (
          *,
          exercises (
            name,
            primary_muscle_groups,
            equipment_needed
          )
        )
      `)
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching workout templates:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getWorkoutTemplates:', error);
    return { data: null, error };
  }
};

/**
 * Creates workout template
 * @param {string} userId - The user ID
 * @param {Object} templateData - Template data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createWorkoutTemplate = async (userId, templateData) => {
  try {
    const { data, error } = await supabase
      .from('workout_templates')
      .insert({
        user_id: userId,
        ...templateData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workout template:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createWorkoutTemplate:', error);
    return { data: null, error };
  }
};

/**
 * Creates workout from template
 * @param {string} userId - The user ID
 * @param {number} templateId - The template ID
 * @param {string} workoutDate - The workout date (YYYY-MM-DD)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createWorkoutFromTemplate = async (userId, templateId, workoutDate) => {
  try {
    // First get the template with exercises
    const { data: template, error: templateError } = await supabase
      .from('workout_templates')
      .select(`
        *,
        template_exercises (
          exercise_id,
          order_in_workout,
          planned_sets,
          planned_reps,
          planned_weight,
          rest_duration_seconds,
          notes
        )
      `)
      .eq('id', templateId)
      .single();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      return { data: null, error: templateError };
    }

    // Create the workout
    const { data: workout, error: workoutError } = await supabase
      .from('user_workouts')
      .insert({
        user_id: userId,
        workout_date: workoutDate,
        name: template.name,
        workout_type: template.workout_type,
        notes: template.notes,
        template_id: templateId
      })
      .select()
      .single();

    if (workoutError) {
      console.error('Error creating workout from template:', workoutError);
      return { data: null, error: workoutError };
    }

    // Add exercises from template
    if (template.template_exercises && template.template_exercises.length > 0) {
      const workoutExercises = template.template_exercises.map(ex => ({
        workout_id: workout.id,
        exercise_id: ex.exercise_id,
        order_in_workout: ex.order_in_workout,
        planned_sets: ex.planned_sets,
        planned_reps: ex.planned_reps,
        planned_weight: ex.planned_weight,
        rest_duration_seconds: ex.rest_duration_seconds,
        notes: ex.notes
      }));

      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .insert(workoutExercises);

      if (exercisesError) {
        console.error('Error adding exercises from template:', exercisesError);
        return { data: null, error: exercisesError };
      }
    }

    return { data: workout, error: null };
  } catch (error) {
    console.error('Unexpected error in createWorkoutFromTemplate:', error);
    return { data: null, error };
  }
};

/**
 * Gets workout statistics for user
 * @param {string} userId - The user ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getWorkoutStats = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('user_workouts')
      .select(`
        id,
        workout_date,
        status,
        total_duration_minutes,
        workout_tags,
        workout_exercises (
          id,
          exercises (
            primary_muscle_groups
          )
        )
      `)
      .eq('user_id', userId)
      .gte('workout_date', startDateStr)
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching workout stats:', error);
      return { data: null, error };
    }

    // Calculate statistics
    const stats = {
      totalWorkouts: data.length,
      totalDuration: data.reduce((sum, w) => sum + (w.total_duration_minutes || 0), 0),
      averageDuration: data.length > 0 ? Math.round(data.reduce((sum, w) => sum + (w.total_duration_minutes || 0), 0) / data.length) : 0,
      workoutsByTags: {},
      muscleGroupsWorked: {},
      workoutsThisWeek: 0,
      workoutsThisMonth: 0
    };

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    data.forEach(workout => {
      const workoutDate = new Date(workout.workout_date);
      
      // Count by tags
      if (workout.workout_tags && workout.workout_tags.length > 0) {
        workout.workout_tags.forEach(tag => {
          stats.workoutsByTags[tag] = (stats.workoutsByTags[tag] || 0) + 1;
        });
      }

      // Count this week/month
      if (workoutDate >= weekAgo) stats.workoutsThisWeek++;
      if (workoutDate >= monthAgo) stats.workoutsThisMonth++;

      // Count muscle groups
      workout.workout_exercises?.forEach(we => {
        if (we.exercises?.primary_muscle_groups) {
          we.exercises.primary_muscle_groups.forEach(group => {
            stats.muscleGroupsWorked[group] = (stats.muscleGroupsWorked[group] || 0) + 1;
          });
        }
      });
    });

    return { data: stats, error: null };
  } catch (error) {
    console.error('Unexpected error in getWorkoutStats:', error);
    return { data: null, error };
  }
}; 