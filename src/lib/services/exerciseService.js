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
 * @param {boolean} options.includePrivate - Include user's private exercises (default: true)
 * @returns {Promise<{data: Array|null, error: Error|null, count: number|null}>}
 */
export const getExercises = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      muscleGroup, 
      equipment, 
      search,
      includePrivate = true
    } = options;

    let query = supabase
      .from('exercises')
      .select(`
        *,
        created_by_profile:profiles!created_by(
          id,
          first_name,
          last_name,
          full_name
        )
      `, { count: 'exact' });

    // Apply filters for TEXT arrays
    if (muscleGroup && muscleGroup !== 'all') {
      query = query.contains('primary_muscle_groups', [muscleGroup]);
    }
    if (equipment && equipment !== 'all') {
      query = query.contains('equipment_needed', [equipment]);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by system exercises first, then by name
    query = query.order('is_system', { ascending: false });
    query = query.order('name');

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching exercises:', error);
      return { data: null, error, count: null };
    }

    return { data, error: null, count };
  } catch (error) {
    console.error('Error in getExercises:', error);
    return { data: null, error, count: null };
  }
};

/**
 * Gets exercise by ID
 * @param {string} exerciseId - The exercise ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getExerciseById = async (exerciseId) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', exerciseId)
      .single();

    if (error) {
      console.error('Error fetching exercise by ID:', error);
      return { data: null, error };
    }

    // Transform data to match expected format
    const transformedData = {
      ...data,
      muscle_groups: {
        name: data.primary_muscle_groups?.[0] || 'Full Body',
        all: data.primary_muscle_groups || []
      },
      equipment_needed: {
        name: data.equipment_needed?.[0] || 'Bodyweight',
        all: data.equipment_needed || []
      }
    };

    return { data: transformedData, error: null };
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
 * @param {string} muscleGroupName - The muscle group name
 * @param {number} limit - Number of exercises to fetch (default: 10)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getExercisesByMuscleGroup = async (muscleGroupName, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .contains('primary_muscle_groups', [muscleGroupName])
      .limit(limit)
      .order('name');

    if (error) {
      console.error('Error fetching exercises by muscle group:', error);
      return { data: null, error };
    }

    // Transform data to match expected format
    const transformedData = data?.map(exercise => ({
      ...exercise,
      muscle_groups: {
        name: exercise.primary_muscle_groups?.[0] || 'Full Body',
        all: exercise.primary_muscle_groups || []
      },
      equipment_needed: {
        name: exercise.equipment_needed?.[0] || 'Bodyweight',
        all: exercise.equipment_needed || []
      }
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Unexpected error in getExercisesByMuscleGroup:', error);
    return { data: null, error };
  }
};

/**
 * Gets exercises by equipment type
 * @param {string} equipmentName - The equipment name
 * @param {number} limit - Number of exercises to fetch (default: 10)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getExercisesByEquipment = async (equipmentName, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .contains('equipment_needed', [equipmentName])
      .limit(limit)
      .order('name');

    if (error) {
      console.error('Error fetching exercises by equipment:', error);
      return { data: null, error };
    }

    // Transform data to match expected format
    const transformedData = data?.map(exercise => ({
      ...exercise,
      muscle_groups: {
        name: exercise.primary_muscle_groups?.[0] || 'Full Body',
        all: exercise.primary_muscle_groups || []
      },
      equipment_needed: {
        name: exercise.equipment_needed?.[0] || 'Bodyweight',
        all: exercise.equipment_needed || []
      }
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Unexpected error in getExercisesByEquipment:', error);
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
    // For now, return empty array since personal records table structure needs to be defined
    console.log('Personal records feature not yet implemented');
    return { data: [], error: null };
  } catch (error) {
    console.error('Unexpected error in getAllPersonalRecords:', error);
    return { data: null, error };
  }
};

/**
 * Creates or updates a personal record
 * @param {string} userId - The user ID
 * @param {string} exerciseId - The exercise ID
 * @param {Object} recordData - Record data (weight, reps, distance, etc.)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const upsertPersonalRecord = async (userId, exerciseId, recordData) => {
  try {
    // For now, return empty object since personal records table structure needs to be defined
    console.log('Personal records feature not yet implemented');
    return { data: {}, error: null };
  } catch (error) {
    console.error('Unexpected error in upsertPersonalRecord:', error);
    return { data: null, error };
  }
};

/**
 * Creates a new exercise (public or private)
 * @param {string} userId - ID of the user creating the exercise
 * @param {Object} exerciseData - Exercise data
 * @param {boolean} isPublic - Whether the exercise should be public
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createExercise = async (userId, exerciseData, isPublic = false) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .insert({
        ...exerciseData,
        created_by: userId,
        is_public: isPublic,
        is_system: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        *,
        created_by_profile:profiles!created_by(
          id,
          first_name,
          last_name,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating exercise:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in createExercise:', error);
    return { data: null, error };
  }
};

/**
 * Updates an existing exercise (only by creator)
 * @param {string} exerciseId - ID of the exercise to update
 * @param {string} userId - ID of the user updating the exercise
 * @param {Object} exerciseData - Updated exercise data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateExercise = async (exerciseId, userId, exerciseData) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .update({
        ...exerciseData,
        updated_at: new Date().toISOString()
      })
      .eq('id', exerciseId)
      .eq('created_by', userId)
      .select(`
        *,
        created_by_profile:profiles!created_by(
          id,
          first_name,
          last_name,
          full_name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating exercise:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in updateExercise:', error);
    return { data: null, error };
  }
};

/**
 * Deletes an exercise (only by creator, not system exercises)
 * @param {string} exerciseId - ID of the exercise to delete
 * @param {string} userId - ID of the user deleting the exercise
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteExercise = async (exerciseId, userId) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId)
      .eq('created_by', userId)
      .eq('is_system', false)
      .select()
      .single();

    if (error) {
      console.error('Error deleting exercise:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in deleteExercise:', error);
    return { data: null, error };
  }
};

/**
 * Gets user's created exercises
 * @param {string} userId - ID of the user
 * @param {boolean} includePrivate - Whether to include private exercises
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserCreatedExercises = async (userId, includePrivate = true) => {
  try {
    let query = supabase
      .from('exercises')
      .select(`
        *,
        created_by_profile:profiles!created_by(
          id,
          first_name,
          last_name,
          full_name
        )
      `)
      .eq('created_by', userId);

    if (!includePrivate) {
      query = query.eq('is_public', true);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching user exercises:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserCreatedExercises:', error);
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
      .select('*')
      .eq('created_by', userId)
      .eq('is_public', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user custom exercises:', error);
      return { data: null, error };
    }

    // Transform data to match expected format
    const transformedData = data?.map(exercise => ({
      ...exercise,
      muscle_groups: {
        name: exercise.primary_muscle_groups?.[0] || 'Full Body',
        all: exercise.primary_muscle_groups || []
      },
      equipment_needed: {
        name: exercise.equipment_needed?.[0] || 'Bodyweight',
        all: exercise.equipment_needed || []
      }
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserCustomExercises:', error);
    return { data: null, error };
  }
};

/**
 * Updates custom exercise
 * @param {string} exerciseId - The exercise ID
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
      .eq('created_by', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating custom exercise:', error);
      return { data: null, error };
    }

    // Transform data to match expected format
    const transformedData = {
      ...data,
      muscle_groups: {
        name: data.primary_muscle_groups?.[0] || 'Full Body',
        all: data.primary_muscle_groups || []
      },
      equipment_needed: {
        name: data.equipment_needed?.[0] || 'Bodyweight',
        all: data.equipment_needed || []
      }
    };

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Unexpected error in updateCustomExercise:', error);
    return { data: null, error };
  }
};

/**
 * Deletes custom exercise
 * @param {string} exerciseId - The exercise ID
 * @param {string} userId - The user ID (to verify ownership)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteCustomExercise = async (exerciseId, userId) => {
  try {
    const { data, error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', exerciseId)
      .eq('created_by', userId)
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
    // For now, just return the most recently created exercises as "popular"
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching popular exercises:', error);
      return { data: null, error };
    }

    // Transform data to match expected format
    const transformedData = data?.map(exercise => ({
      ...exercise,
      muscle_groups: {
        name: exercise.primary_muscle_groups?.[0] || 'Full Body',
        all: exercise.primary_muscle_groups || []
      },
      equipment_needed: {
        name: exercise.equipment_needed?.[0] || 'Bodyweight',
        all: exercise.equipment_needed || []
      }
    }));

    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Unexpected error in getPopularExercises:', error);
    return { data: null, error };
  }
}; 