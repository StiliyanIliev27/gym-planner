import { supabase } from '../supabase/client';

/**
 * Exercise Service - Handles all exercise-related database operations
 * Includes exercises, muscle groups, equipment, and personal records
 */

/**
 * Gets all exercises with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.muscleGroup - Filter by muscle group
 * @param {string} options.equipment - Filter by equipment
 * @param {string} options.search - Search term for exercise name
 * @returns {Promise<{data: Array|null, error: Error|null, count: number|null}>}
 */
export const getExercises = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      muscleGroup, 
      equipment, 
      search 
    } = options;

    let query = supabase
      .from('exercises')
      .select(`
        *,
        muscle_groups(name, description),
        equipment(name, description)
      `, { count: 'exact' });

    // Apply filters
    if (muscleGroup) {
      query = query.eq('muscle_group', muscleGroup);
    }
    if (equipment) {
      query = query.eq('equipment_needed', equipment);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by name
    query = query.order('name');

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching exercises:', error);
      return { data: null, error, count: null };
    }

    return { data, error: null, count };
  } catch (error) {
    console.error('Unexpected error in getExercises:', error);
    return { data: null, error, count: null };
  }
};

/**
 * Gets exercise by ID
 * @param {number} exerciseId - The exercise ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getExerciseById = async (exerciseId) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select(`
        *,
        muscle_groups(name, description),
        equipment(name, description)
      `)
      .eq('id', exerciseId)
      .single();

    if (error) {
      console.error('Error fetching exercise by ID:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getExerciseById:', error);
    return { data: null, error };
  }
};

/**
 * Gets all muscle groups
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getMuscleGroups = async () => {
  try {
    const { data, error } = await supabase
      .from('muscle_groups')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching muscle groups:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getMuscleGroups:', error);
    return { data: null, error };
  }
};

/**
 * Gets all equipment
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getEquipment = async () => {
  try {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching equipment:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getEquipment:', error);
    return { data: null, error };
  }
};

/**
 * Gets exercises by muscle group
 * @param {string} muscleGroupId - The muscle group ID
 * @param {number} limit - Number of exercises to fetch (default: 10)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getExercisesByMuscleGroup = async (muscleGroupId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select(`
        *,
        muscle_groups(name),
        equipment(name)
      `)
      .eq('muscle_group', muscleGroupId)
      .limit(limit)
      .order('name');

    if (error) {
      console.error('Error fetching exercises by muscle group:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getExercisesByMuscleGroup:', error);
    return { data: null, error };
  }
};

/**
 * Gets exercises by equipment type
 * @param {string} equipmentId - The equipment ID
 * @param {number} limit - Number of exercises to fetch (default: 10)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getExercisesByEquipment = async (equipmentId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select(`
        *,
        muscle_groups(name),
        equipment(name)
      `)
      .eq('equipment_needed', equipmentId)
      .limit(limit)
      .order('name');

    if (error) {
      console.error('Error fetching exercises by equipment:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getExercisesByEquipment:', error);
    return { data: null, error };
  }
};

/**
 * Gets user's personal records for an exercise
 * @param {string} userId - The user ID
 * @param {number} exerciseId - The exercise ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getPersonalRecords = async (userId, exerciseId) => {
  try {
    const { data, error } = await supabase
      .from('exercise_personal_records')
      .select(`
        *,
        exercises(name, muscle_group)
      `)
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .order('achieved_at', { ascending: false });

    if (error) {
      console.error('Error fetching personal records:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getPersonalRecords:', error);
    return { data: null, error };
  }
};

/**
 * Gets all personal records for a user
 * @param {string} userId - The user ID
 * @param {number} limit - Number of records to fetch (default: 20)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getAllPersonalRecords = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('exercise_personal_records')
      .select(`
        *,
        exercises(name, muscle_group)
      `)
      .eq('user_id', userId)
      .order('achieved_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching all personal records:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getAllPersonalRecords:', error);
    return { data: null, error };
  }
};

/**
 * Creates or updates a personal record
 * @param {string} userId - The user ID
 * @param {number} exerciseId - The exercise ID
 * @param {Object} recordData - Record data (weight, reps, distance, etc.)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const upsertPersonalRecord = async (userId, exerciseId, recordData) => {
  try {
    const { data, error } = await supabase
      .from('exercise_personal_records')
      .upsert({
        user_id: userId,
        exercise_id: exerciseId,
        ...recordData
      })
      .select(`
        *,
        exercises(name, muscle_group)
      `)
      .single();

    if (error) {
      console.error('Error upserting personal record:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in upsertPersonalRecord:', error);
    return { data: null, error };
  }
};

/**
 * Creates a custom exercise
 * @param {string} userId - The user ID (for user-created exercises)
 * @param {Object} exerciseData - Exercise data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createCustomExercise = async (userId, exerciseData) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        created_by_user: userId,
        is_custom: true,
        ...exerciseData
      })
      .select(`
        *,
        muscle_groups(name),
        equipment(name)
      `)
      .single();

    if (error) {
      console.error('Error creating custom exercise:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createCustomExercise:', error);
    return { data: null, error };
  }
};

/**
 * Gets user's custom exercises
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserCustomExercises = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select(`
        *,
        muscle_groups(name),
        equipment(name)
      `)
      .eq('created_by_user', userId)
      .eq('is_custom', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user custom exercises:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserCustomExercises:', error);
    return { data: null, error };
  }
};

/**
 * Updates custom exercise
 * @param {number} exerciseId - The exercise ID
 * @param {string} userId - The user ID (to verify ownership)
 * @param {Object} exerciseData - Exercise data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateCustomExercise = async (exerciseId, userId, exerciseData) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .update(exerciseData)
      .eq('id', exerciseId)
      .eq('created_by_user', userId)
      .eq('is_custom', true)
      .select(`
        *,
        muscle_groups(name),
        equipment(name)
      `)
      .single();

    if (error) {
      console.error('Error updating custom exercise:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateCustomExercise:', error);
    return { data: null, error };
  }
};

/**
 * Deletes custom exercise
 * @param {number} exerciseId - The exercise ID
 * @param {string} userId - The user ID (to verify ownership)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteCustomExercise = async (exerciseId, userId) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId)
      .eq('created_by_user', userId)
      .eq('is_custom', true)
      .select()
      .single();

    if (error) {
      console.error('Error deleting custom exercise:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in deleteCustomExercise:', error);
    return { data: null, error };
  }
};

/**
 * Gets popular exercises based on workout frequency
 * @param {number} limit - Number of exercises to fetch (default: 10)
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getPopularExercises = async (limit = 10, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('workout_exercises')
      .select(`
        exercise_id,
        exercises(
          id,
          name,
          muscle_group,
          equipment_needed,
          muscle_groups(name),
          equipment(name)
        ),
        user_workouts!inner(workout_date)
      `)
      .gte('user_workouts.workout_date', startDateStr);

    if (error) {
      console.error('Error fetching popular exercises:', error);
      return { data: null, error };
    }

    // Count frequency and format data
    const exerciseFrequency = {};
    data.forEach(item => {
      const exerciseId = item.exercise_id;
      if (!exerciseFrequency[exerciseId]) {
        exerciseFrequency[exerciseId] = {
          ...item.exercises,
          frequency: 0
        };
      }
      exerciseFrequency[exerciseId].frequency++;
    });

    // Sort by frequency and limit
    const popularExercises = Object.values(exerciseFrequency)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);

    return { data: popularExercises, error: null };
  } catch (error) {
    console.error('Unexpected error in getPopularExercises:', error);
    return { data: null, error };
  }
}; 