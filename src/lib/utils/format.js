/**
 * Format date to readable string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format time duration in minutes to readable string
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Format weight with unit
 */
export function formatWeight(weight, unit = 'kg') {
  return `${weight} ${unit}`;
}

/**
 * Format height with unit
 */
export function formatHeight(height, unit = 'cm') {
  return `${height} ${unit}`;
}

/**
 * Format calories
 */
export function formatCalories(calories) {
  return `${calories} cal`;
}

/**
 * Format percentage
 */
export function formatPercentage(value, decimals = 0) {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Format exercise sets (e.g., "3x12")
 */
export function formatSets(sets, reps) {
  return `${sets}x${reps}`;
}

/**
 * Format rest time
 */
export function formatRestTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (remainingSeconds === 0) {
    return `${minutes}min`;
  }
  
  return `${minutes}min ${remainingSeconds}s`;
} 