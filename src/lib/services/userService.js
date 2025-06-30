import { supabase } from '../supabase/client';

/**
 * User Service - Handles all user-related database operations
 * Includes profile management, goals, preferences, and measurements
 */

/**
 * Gets user profile by ID
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        user_goals(*),
        user_preferences(*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserProfile:', error);
    return { data: null, error };
  }
};

/**
 * Updates user profile
 * @param {string} userId - The user ID
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateUserProfile:', error);
    return { data: null, error };
  }
};

/**
 * Gets user goals
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserGoals = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user goals:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserGoals:', error);
    return { data: null, error };
  }
};

/**
 * Creates or updates user goal
 * @param {string} userId - The user ID
 * @param {Object} goalData - Goal data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const upsertUserGoal = async (userId, goalData) => {
  try {
    const { data, error } = await supabase
      .from('user_goals')
      .upsert({
        user_id: userId,
        ...goalData
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting user goal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in upsertUserGoal:', error);
    return { data: null, error };
  }
};

/**
 * Gets user preferences
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getUserPreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching user preferences:', error);
      return { data: null, error };
    }

    return { data: data || {}, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserPreferences:', error);
    return { data: null, error };
  }
};

/**
 * Updates user preferences
 * @param {string} userId - The user ID
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating user preferences:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateUserPreferences:', error);
    return { data: null, error };
  }
};

// Note: Measurement functions moved to progressService.js to avoid conflicts

/**
 * Gets user's daily stats for a date range
 * @param {string} userId - The user ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserDailyStats = async (userId, startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('daily_stats')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching daily stats:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserDailyStats:', error);
    return { data: null, error };
  }
};

/**
 * Upserts daily stats for a user
 * @param {string} userId - The user ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {Object} statsData - Stats data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const upsertDailyStats = async (userId, date, statsData) => {
  try {
    const { data, error } = await supabase
      .from('daily_stats')
      .upsert({
        user_id: userId,
        date,
        ...statsData
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting daily stats:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in upsertDailyStats:', error);
    return { data: null, error };
  }
};

// Note: Achievement functions moved to progressService.js to avoid conflicts

/**
 * Tests database connectivity by fetching current user session
 * @returns {Promise<{success: boolean, data: Object|null, error: Error|null}>}
 */
export const testDatabaseConnection = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error testing database connection:', error);
      return { success: false, data: null, error };
    }

    // Try a simple query to test database access
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profileError) {
      console.error('Error testing database query:', profileError);
      return { success: false, data: null, error: profileError };
    }

    return { 
      success: true, 
      data: { 
        session: !!session,
        database: true,
        message: 'Database connection successful'
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Unexpected error in testDatabaseConnection:', error);
    return { success: false, data: null, error };
  }
}; 