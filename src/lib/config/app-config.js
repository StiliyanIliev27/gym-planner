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
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },

  // Feature flags
  features: {
    aiWorkoutBuilder: true,
    dietBuilder: true,
    socialFeatures: false,
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

// Environment-specific settings
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production"; 