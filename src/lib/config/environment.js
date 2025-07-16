/**
 * Environment configuration helper
 * Manages different environment setups based on NEXT_PUBLIC_APPLICATION_ENVIRONMENT value
 */

// Get environment from NEXT_PUBLIC_APPLICATION_ENVIRONMENT or fallback to development
const getEnvironment = () => {
  return process.env.NEXT_PUBLIC_APPLICATION_ENVIRONMENT || 'development';
};

// Environment configurations
const ENVIRONMENT_CONFIG = {
  development: {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_DEV,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_DEV,
    },
    api: {
      baseUrl: 'http://localhost:3000',
    },
    features: {
      debug: true,
      logging: true,
      mockData: true,
    }
  },
  
  production: {
    supabase: {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_PROD,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD,
      serviceRoleKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY_PROD,
    },
    api: {
      baseUrl: 'https://yourdomain.com',
    },
    features: {
      debug: false,
      logging: false,
      mockData: false,
    }
  }
};

// Current environment
export const CURRENT_ENVIRONMENT = getEnvironment();

// Get configuration for current environment
const getCurrentConfig = () => {
  const config = ENVIRONMENT_CONFIG[CURRENT_ENVIRONMENT];

  if (!config) {
    console.warn(`Unknown environment: ${CURRENT_ENVIRONMENT}. Falling back to development.`);
    return ENVIRONMENT_CONFIG.development;
  }
  
  return config;
};

// Export current environment configuration
export const ENV_CONFIG = getCurrentConfig();

// Environment check helpers
export const isDevelopment = CURRENT_ENVIRONMENT === 'development';
export const isProduction = CURRENT_ENVIRONMENT === 'production';

// Supabase configuration
export const SUPABASE_CONFIG = {
  url: ENV_CONFIG.supabase.url,
  anonKey: ENV_CONFIG.supabase.anonKey,
  serviceRoleKey: ENV_CONFIG.supabase.serviceRoleKey,
};

// API configuration
export const API_CONFIG = {
  baseUrl: ENV_CONFIG.api.baseUrl,
};

// Feature flags
export const FEATURE_FLAGS = ENV_CONFIG.features;

// Debug helper
export const logEnvironmentInfo = () => {
  if (FEATURE_FLAGS.logging) {
    console.log('🌍 Environment Info:', {
      environment: CURRENT_ENVIRONMENT,
      supabaseUrl: SUPABASE_CONFIG.url,
      apiBaseUrl: API_CONFIG.baseUrl,
      features: FEATURE_FLAGS,
    });
  }
};

// Validation helper
export const validateEnvironmentConfig = () => {
  const errors = [];
  
  if (!SUPABASE_CONFIG.url) {
    errors.push('Supabase URL is missing');
  }
  
  if (!SUPABASE_CONFIG.anonKey) {
    errors.push('Supabase anonymous key is missing');
  }
  
  // Only validate production keys for production
  if (isProduction && !SUPABASE_CONFIG.serviceRoleKey) {
    errors.push('Supabase service role key is missing for production');
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment configuration errors:', errors);
    return false;
  }
  
  if (FEATURE_FLAGS.logging) {
    console.log('✅ Environment configuration is valid');
  }
  
  return true;
}; 