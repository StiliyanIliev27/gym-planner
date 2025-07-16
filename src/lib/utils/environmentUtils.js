/**
 * Environment utilities and helper functions
 * Practical examples of using the environment configuration system
 */

import { 
  CURRENT_ENVIRONMENT, 
  SUPABASE_CONFIG, 
  API_CONFIG, 
  FEATURE_FLAGS,
  isDevelopment,
  isProduction
} from '../config/environment.js';

/**
 * Get environment-specific API URL with endpoint
 * @param {string} endpoint - API endpoint path
 * @returns {string} Full API URL
 */
export const getApiUrl = (endpoint = '') => {
  const baseUrl = API_CONFIG.baseUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Check if feature is enabled based on environment
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} Whether feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  return FEATURE_FLAGS[featureName] || false;
};

/**
 * Get environment-specific configuration values
 * @returns {object} Environment configuration object
 */
export const getEnvironmentConfig = () => ({
  environment: CURRENT_ENVIRONMENT,
  supabase: {
    url: SUPABASE_CONFIG.url,
    hasValidConfig: !!(SUPABASE_CONFIG.url && (isDevelopment || SUPABASE_CONFIG.anonKey))
  },
  api: {
    baseUrl: API_CONFIG.baseUrl
  },
  features: FEATURE_FLAGS,
  isDev: isDevelopment,
  isProd: isProduction
});

/**
 * Environment-aware console logging
 * Only logs in development environments
 * @param {string} level - Log level (log, warn, error, info)
 * @param {...any} args - Arguments to log
 */
export const envLog = (level = 'log', ...args) => {
  if (FEATURE_FLAGS.logging && typeof console[level] === 'function') {
    console[level](`[${CURRENT_ENVIRONMENT.toUpperCase()}]`, ...args);
  }
};

/**
 * Environment-aware error handling
 * Shows different error messages based on environment
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 */
export const handleEnvironmentError = (error, context = 'Unknown') => {
  if (isDevelopment) {
    // Detailed error info in development
    console.error(`[DEV ERROR - ${context}]`, {
      message: error.message,
      stack: error.stack,
      environment: CURRENT_ENVIRONMENT,
      timestamp: new Date().toISOString()
    });
  } else {
    // Minimal error info in production
    console.error(`Error in ${context}:`, error.message);
  }
};

/**
 * Create environment-specific fetch configuration
 * @param {object} options - Additional fetch options
 * @returns {object} Fetch configuration object
 */
export const createFetchConfig = (options = {}) => {
  const baseConfig = {
    headers: {
      'Content-Type': 'application/json',
      'X-Environment': CURRENT_ENVIRONMENT,
      ...options.headers
    }
  };

  // Add additional headers in development
  if (isDevelopment) {
    baseConfig.headers['X-Debug'] = 'true';
  }

  return { ...baseConfig, ...options };
};

/**
 * Environment-specific timeout values
 * @param {string} type - Type of operation (api, upload, download)
 * @returns {number} Timeout in milliseconds
 */
export const getTimeout = (type = 'api') => {
  const timeouts = {
    development: {
      api: 30000,      // 30 seconds
      upload: 120000,  // 2 minutes
      download: 60000  // 1 minute
    },
    production: {
      api: 10000,      // 10 seconds
      upload: 300000,  // 5 minutes
      download: 180000 // 3 minutes
    }
  };

  return timeouts[CURRENT_ENVIRONMENT]?.[type] || timeouts.development[type];
};

/**
 * Get environment-specific database connection settings
 * @returns {object} Database configuration
 */
export const getDatabaseConfig = () => ({
  url: SUPABASE_CONFIG.url,
  key: SUPABASE_CONFIG.anonKey,
  serviceRoleKey: SUPABASE_CONFIG.serviceRoleKey,
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Environment': CURRENT_ENVIRONMENT
      }
    }
  }
});

/**
 * Environment-specific cache settings
 * @returns {object} Cache configuration
 */
export const getCacheConfig = () => ({
  ttl: isDevelopment ? 300 : 3600, // 5 minutes in dev, 1 hour in prod
  maxSize: isDevelopment ? 50 : 200,
  enablePersistence: isProduction
});

/**
 * Check if current environment allows certain operations
 * @param {string} operation - Operation to check (debug, mock, analytics)
 * @returns {boolean} Whether operation is allowed
 */
export const isOperationAllowed = (operation) => {
  const allowedOperations = {
    development: ['debug', 'mock', 'analytics', 'testing'],
    production: ['analytics']
  };

  return allowedOperations[CURRENT_ENVIRONMENT]?.includes(operation) || false;
};

// Export environment info for easy debugging
export const environmentInfo = {
  current: CURRENT_ENVIRONMENT,
  config: getEnvironmentConfig(),
  utils: {
    getApiUrl,
    isFeatureEnabled,
    envLog,
    handleEnvironmentError,
    createFetchConfig,
    getTimeout,
    getDatabaseConfig,
    getCacheConfig,
    isOperationAllowed
  }
}; 