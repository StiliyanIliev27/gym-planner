'use client';

import { useEffect } from 'react';
import { 
  CURRENT_ENVIRONMENT, 
  validateEnvironmentConfig, 
  logEnvironmentInfo,
  FEATURE_FLAGS 
} from '@/lib/config/environment.js';

/**
 * Client-side environment initializer component
 * Validates and logs environment configuration on app startup
 */
export default function EnvironmentInitializer() {
  useEffect(() => {
    // Validate environment configuration
    const isValid = validateEnvironmentConfig();
    
    // Log environment info in development/staging
    if (FEATURE_FLAGS.logging) {
      logEnvironmentInfo();
      
      if (!isValid) {
        console.warn('⚠️ Environment validation failed. Please check your .env.local configuration.');
      }
    }
    
    // Add environment indicator to document for debugging
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-environment', CURRENT_ENVIRONMENT);
    }
  }, []);

  // This component doesn't render anything
  return null;
} 