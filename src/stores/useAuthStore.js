import { create } from "zustand";
import { devtools } from "zustand/middleware";


export const useAuthStore = create(devtools((set) => ({
  user: null,
  isLoading: true,  // initially true while loading user session
  signUpEmail: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSignUpEmail: (email) => set({ signUpEmail: email }),
  clearSignUpEmail: () => set({ signUpEmail: null })
})));