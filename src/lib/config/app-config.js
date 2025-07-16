import { API_CONFIG, isDevelopment, isProduction, FEATURE_FLAGS } from "./environment.js";

// Application configuration constants
export const APP_CONFIG = {
  name: "Gym Planner",
  description: "AI-powered fitness planning application",
  version: "1.0.0",
  
  // Navigation
  navigation: {
    mainNavItems: [
      { title: "Dashboard", href: "/dashboard", icon: "Home" },
      { title: "Workout Builder", href: "/workout-builder", icon: "Dumbbell" },
      { title: "Diet Builder", href: "/diet-builder", icon: "Apple" },
    ]
  },

  // API endpoints
  api: {
    baseUrl: API_CONFIG.baseUrl,
  },

  // Feature flags (now managed by environment helper)
  features: {
    aiWorkoutBuilder: true,
    dietBuilder: true,
    socialFeatures: false,
    // Include environment-specific features
    ...FEATURE_FLAGS,
  },

  // UI Settings
  ui: {
    sidebar: {
      defaultCollapsed: false,
    },
    theme: {
      defaultTheme: "light",
    }
  }
};

// Environment-specific settings (now imported from environment helper)
export { isDevelopment, isProduction }; 