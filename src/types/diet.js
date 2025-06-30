// Diet-related type definitions and schemas

/**
 * Food item structure
 */
export const FoodItemSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  calories_per_100g: 'number',
  macros: {
    protein: 'number',
    carbs: 'number',
    fat: 'number',
    fiber: 'number'
  },
  category: 'string',
  allergens: 'string[]'
};

/**
 * Meal structure
 */
export const MealSchema = {
  id: 'string',
  name: 'string',
  meal_type: 'string', // breakfast, lunch, dinner, snack
  foods: 'array', // Array of { food_id: string, quantity: number, unit: string }
  total_calories: 'number',
  total_macros: {
    protein: 'number',
    carbs: 'number',
    fat: 'number',
    fiber: 'number'
  }
};

/**
 * Diet plan structure
 */
export const DietPlanSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  goal: 'string',
  daily_calories: 'number',
  daily_macros: {
    protein: 'number',
    carbs: 'number',
    fat: 'number'
  },
  meals: 'Meal[]',
  duration_days: 'number',
  created_at: 'string',
  updated_at: 'string'
};

/**
 * Diet assessment data structure
 */
export const DietAssessmentSchema = {
  basicInfo: {
    age: 'number',
    gender: 'string',
    height: 'number',
    weight: 'number',
    activityLevel: 'string'
  },
  dietGoals: {
    primaryGoal: 'string',
    targetWeight: 'number',
    timeframe: 'string'
  },
  preferences: {
    cuisines: 'string[]',
    mealFrequency: 'number',
    cookingTime: 'string',
    budgetRange: 'string'
  },
  restrictions: {
    allergies: 'string[]',
    dietaryRestrictions: 'string[]',
    dislikedFoods: 'string[]'
  },
  lifestyle: {
    cookingSkill: 'string',
    mealPrepTime: 'string',
    shoppingFrequency: 'string'
  }
}; 