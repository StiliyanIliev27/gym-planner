import { create } from 'zustand';

export const useWorkoutStore = create((set, get) => ({
  // Current workout data
  currentWorkout: null,
  workouts: [],
  isGenerating: false,
  currentPhase: 'assessment', // assessment, generating, editing, preview
  
  // Assessment data
  assessmentData: {
    basicInfo: {},
    fitnessGoals: {},
    experienceLevel: {},
    equipment: {},
    healthLimitations: {}
  },

  // Actions
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  setWorkouts: (workouts) => set({ workouts }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  
  updateAssessmentData: (section, data) => set((state) => ({
    assessmentData: {
      ...state.assessmentData,
      [section]: { ...state.assessmentData[section], ...data }
    }
  })),

  addWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, workout]
  })),

  updateWorkout: (id, updates) => set((state) => ({
    workouts: state.workouts.map(workout => 
      workout.id === id ? { ...workout, ...updates } : workout
    )
  })),

  deleteWorkout: (id) => set((state) => ({
    workouts: state.workouts.filter(workout => workout.id !== id)
  })),

  resetAssessment: () => set({
    assessmentData: {
      basicInfo: {},
      fitnessGoals: {},
      experienceLevel: {},
      equipment: {},
      healthLimitations: {}
    },
    currentPhase: 'assessment'
  })
})); 