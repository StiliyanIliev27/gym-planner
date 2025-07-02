import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  getUserWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  addSetToExercise,
  updateExerciseSet,
  deleteExerciseSet,
  getWorkoutTemplates,
  createWorkoutTemplate,
  createWorkoutFromTemplate,
  getWorkoutStats
} from "@/lib/services";

/**
 * Enhanced Workout Store with real data integration
 * Manages workouts, templates, exercises, and workout builder state
 */
export const useWorkoutStore = create(devtools((set, get) => ({
  // Workout Data
  workouts: [],
  currentWorkout: null,
  workoutTemplates: [],
  workoutStats: null,

  // Workout Builder State
  isGenerating: false,
  currentPhase: 'assessment', // assessment, generating, editing, preview
  builderWorkout: null,

  // Assessment data for workout builder
  assessmentData: {
    basicInfo: {},
    fitnessGoals: {},
    experienceLevel: {},
    equipment: {},
    healthLimitations: {}
  },

  // Loading States
  workoutsLoading: false,
  templatesLoading: false,
  statsLoading: false,
  operationLoading: false,

  // Workout CRUD Operations
  loadUserWorkouts: async (userId, days = 30) => {
    if (!userId) return;

    set({ workoutsLoading: true });
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const startDateStr = startDate.toISOString().split('T')[0];

      const { data, error } = await getUserWorkouts(userId, startDateStr, endDate);
      
      if (!error && data) {
        set({ workouts: data });
      } else {
        console.error("Error loading workouts:", error);
        set({ workouts: [] });
      }
    } catch (error) {
      console.error("Unexpected error loading workouts:", error);
      set({ workouts: [] });
    } finally {
      set({ workoutsLoading: false });
    }
  },

  loadWorkout: async (workoutId) => {
    set({ operationLoading: true });
    try {
      const { data, error } = await getWorkoutById(workoutId);
      
      if (!error && data) {
        set({ currentWorkout: data });
        return { success: true, data };
      } else {
        console.error("Error loading workout:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error loading workout:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  createNewWorkout: async (userId, workoutData) => {
    if (!userId) return { success: false, error: "No user ID provided" };

    set({ operationLoading: true });
    try {
      const { data, error } = await createWorkout(userId, workoutData);
      
      if (!error && data) {
        // Add to workouts list
        const currentWorkouts = get().workouts;
        set({ 
          workouts: [data, ...currentWorkouts],
          currentWorkout: data 
        });
        return { success: true, data };
      } else {
        console.error("Error creating workout:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error creating workout:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  updateExistingWorkout: async (workoutId, updates) => {
    set({ operationLoading: true });
    try {
      const { data, error } = await updateWorkout(workoutId, updates);
      
      if (!error && data) {
        // Update in workouts list
        const currentWorkouts = get().workouts;
        const updatedWorkouts = currentWorkouts.map(w => 
          w.id === workoutId ? { ...w, ...data } : w
        );
        
        set({ workouts: updatedWorkouts });
        
        // Update current workout if it's the same
        const { currentWorkout } = get();
        if (currentWorkout?.id === workoutId) {
          set({ currentWorkout: { ...currentWorkout, ...data } });
        }
        
        return { success: true, data };
      } else {
        console.error("Error updating workout:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error updating workout:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  deleteExistingWorkout: async (workoutId) => {
    set({ operationLoading: true });
    try {
      const { data, error } = await deleteWorkout(workoutId);
      
      if (!error) {
        // Remove from workouts list
        const currentWorkouts = get().workouts;
        const updatedWorkouts = currentWorkouts.filter(w => w.id !== workoutId);
        set({ workouts: updatedWorkouts });
        
        // Clear current workout if it's the deleted one
        const { currentWorkout } = get();
        if (currentWorkout?.id === workoutId) {
          set({ currentWorkout: null });
        }
        
        return { success: true };
      } else {
        console.error("Error deleting workout:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error deleting workout:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  // Exercise Management
  addExerciseToCurrentWorkout: async (exerciseId, exerciseData = {}) => {
    const { currentWorkout } = get();
    if (!currentWorkout?.id) return { success: false, error: "No current workout" };

    try {
      const { data, error } = await addExerciseToWorkout(currentWorkout.id, exerciseId, exerciseData);
      
      if (!error && data) {
        // Reload the current workout to get updated data
        await get().loadWorkout(currentWorkout.id);
        return { success: true, data };
      } else {
        console.error("Error adding exercise:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error adding exercise:", error);
      return { success: false, error };
    }
  },

  removeExerciseFromCurrentWorkout: async (workoutExerciseId) => {
    const { currentWorkout } = get();
    if (!currentWorkout?.id) return { success: false, error: "No current workout" };

    try {
      const { data, error } = await removeExerciseFromWorkout(workoutExerciseId);
      
      if (!error) {
        // Reload the current workout to get updated data
        await get().loadWorkout(currentWorkout.id);
        return { success: true };
      } else {
        console.error("Error removing exercise:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error removing exercise:", error);
      return { success: false, error };
    }
  },

  addSetToWorkoutExercise: async (workoutExerciseId, setData) => {
    try {
      const { data, error } = await addSetToExercise(workoutExerciseId, setData);
      
      if (!error && data) {
        // Reload current workout to get updated sets
        const { currentWorkout } = get();
        if (currentWorkout?.id) {
          await get().loadWorkout(currentWorkout.id);
        }
        return { success: true, data };
      } else {
        console.error("Error adding set:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error adding set:", error);
      return { success: false, error };
    }
  },

  updateSet: async (setId, setData) => {
    try {
      const { data, error } = await updateExerciseSet(setId, setData);
      
      if (!error && data) {
        // Reload current workout to get updated sets
        const { currentWorkout } = get();
        if (currentWorkout?.id) {
          await get().loadWorkout(currentWorkout.id);
        }
        return { success: true, data };
      } else {
        console.error("Error updating set:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error updating set:", error);
      return { success: false, error };
    }
  },

  deleteSet: async (setId) => {
    try {
      const { data, error } = await deleteExerciseSet(setId);
      
      if (!error) {
        // Reload current workout to get updated sets
        const { currentWorkout } = get();
        if (currentWorkout?.id) {
          await get().loadWorkout(currentWorkout.id);
        }
        return { success: true };
      } else {
        console.error("Error deleting set:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error deleting set:", error);
      return { success: false, error };
    }
  },

  // Templates Management
  loadWorkoutTemplates: async (userId) => {
    if (!userId) return;

    set({ templatesLoading: true });
    try {
      const { data, error } = await getWorkoutTemplates(userId);
      
      if (!error && data) {
        set({ workoutTemplates: data });
      } else {
        console.error("Error loading templates:", error);
        set({ workoutTemplates: [] });
      }
    } catch (error) {
      console.error("Unexpected error loading templates:", error);
      set({ workoutTemplates: [] });
    } finally {
      set({ templatesLoading: false });
    }
  },

  createTemplate: async (userId, templateData) => {
    if (!userId) return { success: false, error: "No user ID provided" };

    try {
      const { data, error } = await createWorkoutTemplate(userId, templateData);
      
      if (!error && data) {
        // Add to templates list
        const currentTemplates = get().workoutTemplates;
        set({ workoutTemplates: [data, ...currentTemplates] });
        return { success: true, data };
      } else {
        console.error("Error creating template:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error creating template:", error);
      return { success: false, error };
    }
  },

  createWorkoutFromExistingTemplate: async (userId, templateId, workoutDate) => {
    if (!userId) return { success: false, error: "No user ID provided" };

    set({ operationLoading: true });
    try {
      const { data, error } = await createWorkoutFromTemplate(userId, templateId, workoutDate);
      
      if (!error && data) {
        // Add to workouts list
        const currentWorkouts = get().workouts;
        set({ 
          workouts: [data, ...currentWorkouts],
          currentWorkout: data 
        });
        return { success: true, data };
      } else {
        console.error("Error creating workout from template:", error);
        return { success: false, error };
      }
    } catch (error) {
      console.error("Unexpected error creating workout from template:", error);
      return { success: false, error };
    } finally {
      set({ operationLoading: false });
    }
  },

  // Statistics
  loadWorkoutStats: async (userId, days = 30) => {
    if (!userId) return;

    set({ statsLoading: true });
    try {
      const { data, error } = await getWorkoutStats(userId, days);
      
      if (!error && data) {
        set({ workoutStats: data });
      } else {
        console.error("Error loading workout stats:", error);
        set({ workoutStats: null });
      }
    } catch (error) {
      console.error("Unexpected error loading workout stats:", error);
      set({ workoutStats: null });
    } finally {
      set({ statsLoading: false });
    }
  },

  // Workout Builder Actions (kept for backward compatibility)
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  setBuilderWorkout: (workout) => {
    if (typeof workout === 'function') {
      // Support functional updates like React useState
      const currentBuilderWorkout = get().builderWorkout;
      const newWorkout = workout(currentBuilderWorkout);
      set({ builderWorkout: newWorkout });
    } else {
      // Direct value assignment
      set({ builderWorkout: workout });
    }
  },
  
  updateAssessmentData: (section, data) => set((state) => ({
    assessmentData: {
      ...state.assessmentData,
      [section]: { ...state.assessmentData[section], ...data }
    }
  })),

  resetAssessment: () => set({
    assessmentData: {
      basicInfo: {},
      fitnessGoals: {},
      experienceLevel: {},
      equipment: {},
      healthLimitations: {}
    },
    currentPhase: 'assessment',
    builderWorkout: null
  }),

  // Utility getters
  getWorkoutByDate: (date) => {
    const { workouts } = get();
    return workouts.filter(workout => 
      workout.workout_date === date
    );
  },

  getTodaysWorkouts: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().getWorkoutByDate(today);
  },

  getUpcomingWorkouts: () => {
    const { workouts } = get();
    const today = new Date().toISOString().split('T')[0];
    return workouts.filter(workout => 
      workout.workout_date > today && workout.status === 'planned'
    );
  },

  getCompletedWorkoutsCount: () => {
    const { workouts } = get();
    return workouts.filter(workout => workout.status === 'completed').length;
  }
}), {
  name: "workout-store"
})); 