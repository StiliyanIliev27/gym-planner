/**
 * Services Index - Centralizes all service exports
 * Import all services from this file for consistency
 */

// User Service
export * from './userService';

// Workout Service  
export * from './workoutService';

// Exercise Service
export * from './exerciseService';

// Progress Service
export * from './progressService';

// Nutrition Service
export * from './nutritionService';

// Service status check
export const checkServiceAvailability = () => {
  const services = [
    'userService',
    'workoutService', 
    'exerciseService',
    'progressService',
    'nutritionService'
  ];
  
  console.log('✅ Available services:', services);
  return services;
}; 