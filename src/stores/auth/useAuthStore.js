import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserGoals, 
  upsertUserGoal,
  getUserPreferences,
  updateUserPreferences,
  getUserDailyStats
} from "@/lib/services";

/**
 * Enhanced Auth Store with real user data integration
 * Manages authentication state, user profile, goals, and preferences
 */
export const useAuthStore = create(devtools((set, get) => ({
  // Auth State
  user: null,
  isLoading: true,
  signUpEmail: null,

  // User Profile Data
  profile: null,
  goals: [],
  preferences: null,
  dailyStats: null,

  // Loading States
  profileLoading: false,
  goalsLoading: false,
  preferencesLoading: false,

  // Basic Auth Actions
  setUser: (user) => {
    set({ user });
    // Load profile data when user is set
    if (user?.id) {
      get().loadUserProfile(user.id);
    }
  },
  
  clearUser: () => set({ 
    user: null, 
    profile: null, 
    goals: [], 
    preferences: null, 
    dailyStats: null 
  }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setSignUpEmail: (email) => set({ signUpEmail: email }),
  
  clearSignUpEmail: () => set({ signUpEmail: null }),

  // Profile Management
  loadUserProfile: async (userId) => {
    if (!userId) return;
    
    set({ profileLoading: true });
    try {
      const { data: profileData, error } = await getUserProfile(userId);
      
      if (!error && profileData) {
        set({ 
          profile: profileData,
          goals: profileData.user_goals || [],
          preferences: profileData.user_preferences || null
        });
      } else {
        console.error("Error loading user profile:", error);
      }
    } catch (error) {
      console.error("Unexpected error loading profile:", error);
    } finally {
      set({ profileLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    const { user } = get();
    if (!user?.id) return { success: false, error: "No user logged in" };

    set({ profileLoading: true });
    try {
      const { data, error } = await updateUserProfile(user.id, profileData);
      
      if (!error && data) {
        set({ profile: data });
        return { success: true, data };
      } else {
        console.error("Error updating profile:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error updating profile:", error);
      return { success: false, error };
    } finally {
      set({ profileLoading: false });
    }
  },

  // Goals Management
  loadUserGoals: async () => {
    const { user } = get();
    if (!user?.id) return;

    set({ goalsLoading: true });
    try {
      const { data, error } = await getUserGoals(user.id);
      
      if (!error && data) {
        set({ goals: data });
      } else {
        console.error("Error loading goals:", error);
      }
    } catch (error) {
      console.error("Unexpected error loading goals:", error);
    } finally {
      set({ goalsLoading: false });
    }
  },

  updateGoal: async (goalData) => {
    const { user } = get();
    if (!user?.id) return { success: false, error: "No user logged in" };

    try {
      const { data, error } = await upsertUserGoal(user.id, goalData);
      
      if (!error && data) {
        // Update goals in store
        const currentGoals = get().goals;
        const existingIndex = currentGoals.findIndex(g => g.goal_type === data.goal_type);
        
        if (existingIndex >= 0) {
          currentGoals[existingIndex] = data;
        } else {
          currentGoals.push(data);
        }
        
        set({ goals: [...currentGoals] });
        return { success: true, data };
      } else {
        console.error("Error updating goal:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error updating goal:", error);
      return { success: false, error };
    }
  },

  // Preferences Management
  loadUserPreferences: async () => {
    const { user } = get();
    if (!user?.id) return;

    set({ preferencesLoading: true });
    try {
      const { data, error } = await getUserPreferences(user.id);
      
      if (!error) {
        set({ preferences: data || {} });
      } else {
        console.error("Error loading preferences:", error);
      }
    } catch (error) {
      console.error("Unexpected error loading preferences:", error);
    } finally {
      set({ preferencesLoading: false });
    }
  },

  updatePreferences: async (newPreferences) => {
    const { user } = get();
    if (!user?.id) return { success: false, error: "No user logged in" };

    try {
      const { data, error } = await updateUserPreferences(user.id, newPreferences);
      
      if (!error && data) {
        set({ preferences: data });
        return { success: true, data };
      } else {
        console.error("Error updating preferences:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error updating preferences:", error);
      return { success: false, error };
    }
  },

  // Daily Stats
  loadTodayStats: async () => {
    const { user } = get();
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data, error } = await getUserDailyStats(user.id, today, today);
      
      if (!error && data && data.length > 0) {
        set({ dailyStats: data[0] });
      } else {
        // No stats for today yet
        set({ dailyStats: null });
      }
    } catch (error) {
      console.error("Unexpected error loading today's stats:", error);
    }
  },

  // Computed getters
  getFullName: () => {
    const { profile } = get();
    if (!profile?.full_name) return "User";
    return profile.full_name;
  },

  getInitials: () => {
    const { profile } = get();
    if (!profile?.full_name) return "U";
    
    const names = profile.full_name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return profile.full_name[0].toUpperCase();
  },

  hasCompletedProfile: () => {
    const { profile } = get();
    return !!(profile?.full_name && profile?.date_of_birth && profile?.height_cm);
  },

  getCurrentGoal: (goalType) => {
    const { goals } = get();
    return goals.find(goal => goal.goal_type === goalType);
  },

  getPreference: (key, defaultValue = null) => {
    const { preferences } = get();
    return preferences?.[key] ?? defaultValue;
  }
}), {
  name: "auth-store"
}));