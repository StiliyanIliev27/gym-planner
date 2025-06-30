import { create } from 'zustand';

export const useDietStore = create((set, get) => ({
  // Current diet data
  currentDiet: null,
  diets: [],
  isGenerating: false,
  currentPhase: 'assessment', // assessment, generating, editing, preview
  
  // Assessment data
  assessmentData: {
    basicInfo: {},
    dietGoals: {},
    preferences: {},
    restrictions: {},
    lifestyle: {}
  },

  // Actions
  setCurrentDiet: (diet) => set({ currentDiet: diet }),
  setDiets: (diets) => set({ diets }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  
  updateAssessmentData: (section, data) => set((state) => ({
    assessmentData: {
      ...state.assessmentData,
      [section]: { ...state.assessmentData[section], ...data }
    }
  })),

  addDiet: (diet) => set((state) => ({
    diets: [...state.diets, diet]
  })),

  updateDiet: (id, updates) => set((state) => ({
    diets: state.diets.map(diet => 
      diet.id === id ? { ...diet, ...updates } : diet
    )
  })),

  deleteDiet: (id) => set((state) => ({
    diets: state.diets.filter(diet => diet.id !== id)
  })),

  resetAssessment: () => set({
    assessmentData: {
      basicInfo: {},
      dietGoals: {},
      preferences: {},
      restrictions: {},
      lifestyle: {}
    },
    currentPhase: 'assessment'
  })
})); 