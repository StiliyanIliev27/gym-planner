import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getUserMeasurements,
  getLatestMeasurements,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getUserAchievements,
  getAvailableAchievements,
  awardAchievement,
  getProgressMilestones,
  createMilestone,
  updateMilestone,
  getProgressPhotos,
  uploadProgressPhoto,
  getProgressSummary,
  getAllPersonalRecords,
  upsertPersonalRecord
} from "@/lib/services";

/**
 * Progress Store with real data integration
 * Manages measurements, achievements, milestones, photos, and personal records
 */
export const useProgressStore = create(devtools((set, get) => ({
  // Measurements Data
  measurements: [],
  latestMeasurements: null,
  progressSummary: null,

  // Achievements Data
  userAchievements: [],
  availableAchievements: [],
  personalRecords: [],

  // Milestones Data
  milestones: [],

  // Progress Photos
  progressPhotos: [],

  // Loading States
  measurementsLoading: false,
  achievementsLoading: false,
  milestonesLoading: false,
  photosLoading: false,
  recordsLoading: false,
  operationLoading: false,

  // Measurements Management
  loadUserMeasurements: async (userId, days = 90) => {
    if (!userId) return;

    set({ measurementsLoading: true });
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data, error } = await getUserMeasurements(userId, startDateStr, endDate);
      
      if (!error && data) {
        set({ measurements: data });
      } else {
        console.error("Error loading measurements:", error);
        set({ measurements: [] });
      }
    } catch (error) {
      console.error("Unexpected error loading measurements:", error);
      set({ measurements: [] });
    } finally {
      set({ measurementsLoading: false });
    }
  },

  loadLatestMeasurements: async (userId) => {
    if (!userId) return;

    try {
      const { data, error } = await getLatestMeasurements(userId);
      
      if (!error && data) {
        set({ latestMeasurements: data });
      } else {
        console.error("Error loading latest measurements:", error);
        set({ latestMeasurements: null });
      }
    } catch (error) {
      console.error("Unexpected error loading latest measurements:", error);
      set({ latestMeasurements: null });
    }
  },

  addNewMeasurement: async (userId, measurementData) => {
    if (!userId) return { success: false, error: "No user ID provided" };

    set({ operationLoading: true });
    try {
      const { data, error } = await addMeasurement(userId, measurementData);
      
      if (!error && data) {
        // Add to measurements list
        const currentMeasurements = get().measurements;
        set({ measurements: [data, ...currentMeasurements] });
        
        // Update latest measurements if this is newer
        const { latestMeasurements } = get();
        if (!latestMeasurements || data.measurement_date >= latestMeasurements.measurement_date) {
          set({ latestMeasurements: data });
        }
        
        return { success: true, data };
      } else {
        console.error("Error adding measurement:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error adding measurement:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  updateExistingMeasurement: async (measurementId, updates) => {
    set({ operationLoading: true });
    try {
      const { data, error } = await updateMeasurement(measurementId, updates);
      
      if (!error && data) {
        // Update in measurements list
        const currentMeasurements = get().measurements;
        const updatedMeasurements = currentMeasurements.map(m => 
          m.id === measurementId ? { ...m, ...data } : m
        );
        set({ measurements: updatedMeasurements });
        
        // Update latest measurements if this is the current latest
        const { latestMeasurements } = get();
        if (latestMeasurements?.id === measurementId) {
          set({ latestMeasurements: { ...latestMeasurements, ...data } });
        }
        
        return { success: true, data };
      } else {
        console.error("Error updating measurement:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error updating measurement:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  deleteExistingMeasurement: async (measurementId) => {
    set({ operationLoading: true });
    try {
      const { data, error } = await deleteMeasurement(measurementId);
      
      if (!error) {
        // Remove from measurements list
        const currentMeasurements = get().measurements;
        const updatedMeasurements = currentMeasurements.filter(m => m.id !== measurementId);
        set({ measurements: updatedMeasurements });
        
        // Clear latest measurements if this was it
        const { latestMeasurements } = get();
        if (latestMeasurements?.id === measurementId) {
          // Find the new latest
          const sortedMeasurements = updatedMeasurements.sort((a, b) => 
            new Date(b.measurement_date) - new Date(a.measurement_date)
          );
          set({ latestMeasurements: sortedMeasurements[0] || null });
        }
        
        return { success: true };
      } else {
        console.error("Error deleting measurement:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error deleting measurement:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  // Progress Summary
  loadProgressSummary: async (userId, days = 30) => {
    if (!userId) return;

    try {
      const { data, error } = await getProgressSummary(userId, days);
      
      if (!error && data) {
        set({ progressSummary: data });
      } else {
        console.error("Error loading progress summary:", error);
        set({ progressSummary: null });
      }
    } catch (error) {
      console.error("Unexpected error loading progress summary:", error);
      set({ progressSummary: null });
    }
  },

  // Personal Records Management
  loadPersonalRecords: async (userId) => {
    if (!userId) return;

    set({ recordsLoading: true });
    try {
      const { data, error } = await getAllPersonalRecords(userId);
      
      if (!error && data) {
        set({ personalRecords: data });
      } else {
        console.error("Error loading personal records:", error);
        set({ personalRecords: [] });
      }
    } catch (error) {
      console.error("Unexpected error loading personal records:", error);
      set({ personalRecords: [] });
    } finally {
      set({ recordsLoading: false });
    }
  },

  // Achievements Management
  loadUserAchievements: async (userId) => {
    if (!userId) return;

    set({ achievementsLoading: true });
    try {
      const [userAchievementsResult, availableAchievementsResult] = await Promise.all([
        getUserAchievements(userId),
        getAvailableAchievements()
      ]);
      
      if (!userAchievementsResult.error && userAchievementsResult.data) {
        set({ userAchievements: userAchievementsResult.data });
      } else {
        console.error("Error loading user achievements:", userAchievementsResult.error);
        set({ userAchievements: [] });
      }
      
      if (!availableAchievementsResult.error && availableAchievementsResult.data) {
        set({ availableAchievements: availableAchievementsResult.data });
      } else {
        console.error("Error loading available achievements:", availableAchievementsResult.error);
        set({ availableAchievements: [] });
      }
    } catch (error) {
      console.error("Unexpected error loading achievements:", error);
      set({ userAchievements: [], availableAchievements: [] });
    } finally {
      set({ achievementsLoading: false });
    }
  },

  unlockAchievement: async (userId, achievementId) => {
    if (!userId) return { success: false, error: "No user ID provided" };

    try {
      const { data, error } = await awardAchievement(userId, achievementId);
      
      if (!error && data) {
        // Add to user achievements
        const currentAchievements = get().userAchievements;
        set({ userAchievements: [data, ...currentAchievements] });
        
        return { success: true, data };
      } else {
        console.error("Error awarding achievement:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error awarding achievement:", error);
      return { success: false, error };
    }
  },

  // Milestones Management
  loadProgressMilestones: async (userId) => {
    if (!userId) return;

    set({ milestonesLoading: true });
    try {
      const { data, error } = await getProgressMilestones(userId);
      
      if (!error && data) {
        set({ milestones: data });
      } else {
        console.error("Error loading milestones:", error);
        set({ milestones: [] });
      }
    } catch (error) {
      console.error("Unexpected error loading milestones:", error);
      set({ milestones: [] });
    } finally {
      set({ milestonesLoading: false });
    }
  },

  createNewMilestone: async (userId, milestoneData) => {
    if (!userId) return { success: false, error: "No user ID provided" };

    set({ operationLoading: true });
    try {
      const { data, error } = await createMilestone(userId, milestoneData);
      
      if (!error && data) {
        // Add to milestones list
        const currentMilestones = get().milestones;
        set({ milestones: [data, ...currentMilestones] });
        
        return { success: true, data };
      } else {
        console.error("Error creating milestone:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error creating milestone:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  updateExistingMilestone: async (milestoneId, updates) => {
    set({ operationLoading: true });
    try {
      const { data, error } = await updateMilestone(milestoneId, updates);
      
      if (!error && data) {
        // Update in milestones list
        const currentMilestones = get().milestones;
        const updatedMilestones = currentMilestones.map(m => 
          m.id === milestoneId ? { ...m, ...data } : m
        );
        set({ milestones: updatedMilestones });
        
        return { success: true, data };
      } else {
        console.error("Error updating milestone:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error updating milestone:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  // Progress Photos Management
  loadProgressPhotos: async (userId) => {
    if (!userId) return;

    set({ photosLoading: true });
    try {
      const { data, error } = await getProgressPhotos(userId);
      
      if (!error && data) {
        set({ progressPhotos: data });
      } else {
        console.error("Error loading progress photos:", error);
        set({ progressPhotos: [] });
      }
    } catch (error) {
      console.error("Unexpected error loading progress photos:", error);
      set({ progressPhotos: [] });
    } finally {
      set({ photosLoading: false });
    }
  },

  addProgressPhoto: async (userId, photoFile, metadata = {}) => {
    if (!userId) return { success: false, error: "No user ID provided" };

    set({ operationLoading: true });
    try {
      const { data, error } = await uploadProgressPhoto(userId, photoFile, metadata);
      
      if (!error && data) {
        // Add to progress photos list
        const currentPhotos = get().progressPhotos;
        set({ progressPhotos: [data, ...currentPhotos] });
        
        return { success: true, data };
      } else {
        console.error("Error uploading progress photo:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error uploading progress photo:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  // Utility getters
  getCurrentWeight: () => {
    const { latestMeasurements } = get();
    return latestMeasurements?.weight_kg || null;
  },

  getWeightChange: (days = 30) => {
    const { measurements } = get();
    if (measurements.length < 2) return null;

    const sortedMeasurements = measurements
      .filter(m => m.weight_kg !== null)
      .sort((a, b) => new Date(b.measurement_date) - new Date(a.measurement_date));

    if (sortedMeasurements.length < 2) return null;

    const latest = sortedMeasurements[0];
    const comparison = sortedMeasurements.find(m => {
      const daysDiff = Math.abs(
        (new Date(latest.measurement_date) - new Date(m.measurement_date)) / (1000 * 60 * 60 * 24)
      );
      return daysDiff >= days - 5; // Allow 5-day tolerance
    });

    if (!comparison) return null;

    return {
      current: latest.weight_kg,
      previous: comparison.weight_kg,
      change: latest.weight_kg - comparison.weight_kg,
      changePercentage: ((latest.weight_kg - comparison.weight_kg) / comparison.weight_kg) * 100
    };
  },

  getUnlockedAchievementsCount: () => {
    const { userAchievements } = get();
    return userAchievements.length;
  },

  getCompletedMilestonesCount: () => {
    const { milestones } = get();
    return milestones.filter(m => m.status === 'completed').length;
  },

  getPersonalRecordByExercise: (exerciseId, recordType = 'max_weight') => {
    const { personalRecords } = get();
    return personalRecords.find(
      r => r.exercise_id === exerciseId && r.record_type === recordType
    );
  },

  // Load all progress data for a user
  loadAllProgressData: async (userId) => {
    if (!userId) return;

    const promises = [
      get().loadUserMeasurements(userId),
      get().loadLatestMeasurements(userId),
      get().loadUserAchievements(userId),
      get().loadPersonalRecords(userId)
    ];

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
  }
}), {
  name: "progress-store"
})); 