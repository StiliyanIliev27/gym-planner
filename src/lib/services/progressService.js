import { supabase } from '../supabase/client';

/**
 * Progress Service - Handles all progress tracking operations
 * Includes measurements, achievements, milestones, and progress photos
 */

/**
 * Gets user measurements for a date range
 * @param {string} userId - The user ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserMeasurements = async (userId, startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('user_measurements')
      .select('*')
      .eq('user_id', userId)
      .gte('measurement_date', startDate)
      .lte('measurement_date', endDate)
      .order('measurement_date', { ascending: false });

    if (error) {
      console.error('Error fetching user measurements:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserMeasurements:', error);
    return { data: null, error };
  }
};

/**
 * Gets latest user measurements
 * @param {string} userId - The user ID
 * @param {number} limit - Number of measurements to fetch (default: 5)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getLatestMeasurements = async (userId, limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('user_measurements')
      .select('*')
      .eq('user_id', userId)
      .order('measurement_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching latest measurements:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getLatestMeasurements:', error);
    return { data: null, error };
  }
};

/**
 * Adds new measurement
 * @param {string} userId - The user ID
 * @param {Object} measurementData - Measurement data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const addMeasurement = async (userId, measurementData) => {
  try {
    const { data, error } = await supabase
      .from('user_measurements')
      .insert({
        user_id: userId,
        ...measurementData
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding measurement:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in addMeasurement:', error);
    return { data: null, error };
  }
};

/**
 * Updates measurement
 * @param {number} measurementId - The measurement ID
 * @param {Object} measurementData - Measurement data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateMeasurement = async (measurementId, measurementData) => {
  try {
    const { data, error } = await supabase
      .from('user_measurements')
      .update(measurementData)
      .eq('id', measurementId)
      .select()
      .single();

    if (error) {
      console.error('Error updating measurement:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateMeasurement:', error);
    return { data: null, error };
  }
};

/**
 * Deletes measurement
 * @param {number} measurementId - The measurement ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteMeasurement = async (measurementId) => {
  try {
    const { data, error } = await supabase
      .from('user_measurements')
      .delete()
      .eq('id', measurementId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting measurement:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in deleteMeasurement:', error);
    return { data: null, error };
  }
};

/**
 * Gets user achievements
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserAchievements = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement_definitions(
          name,
          description,
          badge_icon,
          category
        )
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) {
      console.error('Error fetching user achievements:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserAchievements:', error);
    return { data: null, error };
  }
};

/**
 * Gets all available achievements with user progress
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getAvailableAchievements = async (userId) => {
  try {
    // Get all achievement definitions
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievement_definitions')
      .select('*')
      .order('category', { ascending: true });

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return { data: null, error: achievementsError };
    }

    // Get user's earned achievements
    const { data: userAchievements, error: userError } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('user_id', userId);

    if (userError) {
      console.error('Error fetching user achievements:', userError);
      return { data: null, error: userError };
    }

    // Merge data
    const achievementsMap = userAchievements.reduce((map, ua) => {
      map[ua.achievement_id] = ua.earned_at;
      return map;
    }, {});

    const result = achievements.map(achievement => ({
      ...achievement,
      earned: !!achievementsMap[achievement.id],
      earned_at: achievementsMap[achievement.id] || null
    }));

    return { data: result, error: null };
  } catch (error) {
    console.error('Unexpected error in getAvailableAchievements:', error);
    return { data: null, error };
  }
};

/**
 * Awards achievement to user
 * @param {string} userId - The user ID
 * @param {number} achievementId - The achievement ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const awardAchievement = async (userId, achievementId) => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        earned_at: new Date().toISOString()
      })
      .select(`
        *,
        achievement_definitions(
          name,
          description,
          badge_icon
        )
      `)
      .single();

    if (error) {
      console.error('Error awarding achievement:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in awardAchievement:', error);
    return { data: null, error };
  }
};

/**
 * Gets progress milestones for user
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getProgressMilestones = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('progress_milestones')
      .select('*')
      .eq('user_id', userId)
      .order('target_date', { ascending: true });

    if (error) {
      console.error('Error fetching progress milestones:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getProgressMilestones:', error);
    return { data: null, error };
  }
};

/**
 * Creates progress milestone
 * @param {string} userId - The user ID
 * @param {Object} milestoneData - Milestone data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createMilestone = async (userId, milestoneData) => {
  try {
    const { data, error } = await supabase
      .from('progress_milestones')
      .insert({
        user_id: userId,
        ...milestoneData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating milestone:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createMilestone:', error);
    return { data: null, error };
  }
};

/**
 * Updates milestone
 * @param {number} milestoneId - The milestone ID
 * @param {Object} milestoneData - Milestone data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateMilestone = async (milestoneId, milestoneData) => {
  try {
    const { data, error } = await supabase
      .from('progress_milestones')
      .update(milestoneData)
      .eq('id', milestoneId)
      .select()
      .single();

    if (error) {
      console.error('Error updating milestone:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateMilestone:', error);
    return { data: null, error };
  }
};

/**
 * Gets progress photos for user
 * @param {string} userId - The user ID
 * @param {number} limit - Number of photos to fetch (default: 20)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getProgressPhotos = async (userId, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', userId)
      .order('photo_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching progress photos:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getProgressPhotos:', error);
    return { data: null, error };
  }
};

/**
 * Uploads progress photo
 * @param {string} userId - The user ID
 * @param {Object} photoData - Photo data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const uploadProgressPhoto = async (userId, photoData) => {
  try {
    const { data, error } = await supabase
      .from('progress_photos')
      .insert({
        user_id: userId,
        ...photoData
      })
      .select()
      .single();

    if (error) {
      console.error('Error uploading progress photo:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in uploadProgressPhoto:', error);
    return { data: null, error };
  }
};

/**
 * Gets comprehensive progress summary for user
 * @param {string} userId - The user ID
 * @param {number} days - Number of days to analyze (default: 30)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getProgressSummary = async (userId, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get measurements
    const { data: measurements } = await getUserMeasurements(userId, startDateStr, new Date().toISOString().split('T')[0]);
    
    // Get achievements
    const { data: achievements } = await getUserAchievements(userId);
    
    // Get milestones
    const { data: milestones } = await getProgressMilestones(userId);
    
    // Get workout stats from another service (assuming it exists)
    const { data: workoutStats } = await supabase
      .from('user_workouts')
              .select('id, status, workout_date, total_duration_minutes')
      .eq('user_id', userId)
      .gte('workout_date', startDateStr)
      .eq('status', 'completed');

    // Calculate summary
    const summary = {
      period: `${days} days`,
      measurements: {
        total: measurements?.length || 0,
        latest: measurements?.[0] || null,
        weightChange: null,
        bodyFatChange: null
      },
      achievements: {
        total: achievements?.length || 0,
        recent: achievements?.slice(0, 3) || []
      },
      milestones: {
        total: milestones?.length || 0,
        completed: milestones?.filter(m => m.is_achieved)?.length || 0,
        upcoming: milestones?.filter(m => !m.is_achieved && new Date(m.target_date) > new Date())?.length || 0
      },
      workouts: {
        completed: workoutStats?.length || 0,
              totalDuration: workoutStats?.reduce((sum, w) => sum + (w.total_duration_minutes || 0), 0) || 0,
      averageDuration: workoutStats?.length > 0 ? Math.round(workoutStats.reduce((sum, w) => sum + (w.total_duration_minutes || 0), 0) / workoutStats.length) : 0
      }
    };

    // Calculate weight and body fat changes
    if (measurements && measurements.length >= 2) {
      const latest = measurements[0];
      const oldest = measurements[measurements.length - 1];
      
      if (latest.weight_kg && oldest.weight_kg) {
        summary.measurements.weightChange = Number((latest.weight_kg - oldest.weight_kg).toFixed(1));
      }
      
      if (latest.body_fat_percentage && oldest.body_fat_percentage) {
        summary.measurements.bodyFatChange = Number((latest.body_fat_percentage - oldest.body_fat_percentage).toFixed(1));
      }
    }

    return { data: summary, error: null };
  } catch (error) {
    console.error('Unexpected error in getProgressSummary:', error);
    return { data: null, error };
  }
}; 