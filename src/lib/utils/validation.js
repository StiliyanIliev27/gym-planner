import { VALIDATION } from './constants';

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
  if (!password) return false;
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) return false;
  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) return false;
  
  // At least one uppercase, one lowercase, one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
}

/**
 * Validate age
 */
export function isValidAge(age) {
  const numAge = parseInt(age);
  return numAge >= VALIDATION.MIN_AGE && numAge <= VALIDATION.MAX_AGE;
}

/**
 * Validate weight
 */
export function isValidWeight(weight) {
  const numWeight = parseFloat(weight);
  return numWeight >= VALIDATION.MIN_WEIGHT && numWeight <= VALIDATION.MAX_WEIGHT;
}

/**
 * Validate height
 */
export function isValidHeight(height) {
  const numHeight = parseFloat(height);
  return numHeight >= VALIDATION.MIN_HEIGHT && numHeight <= VALIDATION.MAX_HEIGHT;
}

/**
 * Validate required field
 */
export function isRequired(value) {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate workout duration (in minutes)
 */
export function isValidWorkoutDuration(minutes) {
  const numMinutes = parseInt(minutes);
  return numMinutes >= 5 && numMinutes <= 300; // 5 minutes to 5 hours
}

/**
 * Validate sets count
 */
export function isValidSets(sets) {
  const numSets = parseInt(sets);
  return numSets >= 1 && numSets <= 20;
}

/**
 * Validate reps count
 */
export function isValidReps(reps) {
  const numReps = parseInt(reps);
  return numReps >= 1 && numReps <= 100;
} 