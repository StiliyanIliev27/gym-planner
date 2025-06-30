import { supabase } from '../supabase/client';

/**
 * Nutrition Service - Handles all nutrition-related database operations
 * Includes foods, meals, recipes, nutrition goals, and water intake
 */

/**
 * Gets all food items with pagination and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.category - Filter by food category
 * @param {string} options.search - Search term for food name
 * @returns {Promise<{data: Array|null, error: Error|null, count: number|null}>}
 */
export const getFoodItems = async (options = {}) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      search 
    } = options;

    let query = supabase
      .from('food_items')
      .select(`
        *,
        food_categories(name, description)
      `, { count: 'exact' });

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Order by name
    query = query.order('name');

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching food items:', error);
      return { data: null, error, count: null };
    }

    return { data, error: null, count };
  } catch (error) {
    console.error('Unexpected error in getFoodItems:', error);
    return { data: null, error, count: null };
  }
};

/**
 * Gets food item by ID
 * @param {number} foodId - The food item ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getFoodItemById = async (foodId) => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select(`
        *,
        food_categories(name, description)
      `)
      .eq('id', foodId)
      .single();

    if (error) {
      console.error('Error fetching food item by ID:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getFoodItemById:', error);
    return { data: null, error };
  }
};

/**
 * Gets all food categories
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getFoodCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('food_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching food categories:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getFoodCategories:', error);
    return { data: null, error };
  }
};

/**
 * Gets user meals for a date range
 * @param {string} userId - The user ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserMeals = async (userId, startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('user_meals')
      .select(`
        *,
        meal_foods (
          *,
          food_items (
            name,
            calories_per_100g,
            protein_g,
            carbs_g,
            fat_g,
            fiber_g,
            sugar_g
          )
        )
      `)
      .eq('user_id', userId)
      .gte('meal_date', startDate)
      .lte('meal_date', endDate)
      .order('meal_date', { ascending: false });

    if (error) {
      console.error('Error fetching user meals:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserMeals:', error);
    return { data: null, error };
  }
};

/**
 * Gets meals for a specific date
 * @param {string} userId - The user ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getMealsForDate = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('user_meals')
      .select(`
        *,
        meal_foods (
          *,
          food_items (
            name,
            calories_per_100g,
            protein_g,
            carbs_g,
            fat_g,
            fiber_g,
            sugar_g
          )
        )
      `)
      .eq('user_id', userId)
      .eq('meal_date', date)
      .order('meal_time');

    if (error) {
      console.error('Error fetching meals for date:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getMealsForDate:', error);
    return { data: null, error };
  }
};

/**
 * Creates a new meal
 * @param {string} userId - The user ID
 * @param {Object} mealData - Meal data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createMeal = async (userId, mealData) => {
  try {
    const { data, error } = await supabase
      .from('user_meals')
      .insert({
        user_id: userId,
        ...mealData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating meal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createMeal:', error);
    return { data: null, error };
  }
};

/**
 * Updates meal
 * @param {number} mealId - The meal ID
 * @param {Object} mealData - Meal data to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateMeal = async (mealId, mealData) => {
  try {
    const { data, error } = await supabase
      .from('user_meals')
      .update(mealData)
      .eq('id', mealId)
      .select()
      .single();

    if (error) {
      console.error('Error updating meal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateMeal:', error);
    return { data: null, error };
  }
};

/**
 * Deletes meal
 * @param {number} mealId - The meal ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deleteMeal = async (mealId) => {
  try {
    const { data, error } = await supabase
      .from('user_meals')
      .delete()
      .eq('id', mealId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting meal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in deleteMeal:', error);
    return { data: null, error };
  }
};

/**
 * Adds food to meal
 * @param {number} mealId - The meal ID
 * @param {number} foodId - The food item ID
 * @param {number} quantity - Quantity in grams
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const addFoodToMeal = async (mealId, foodId, quantity) => {
  try {
    const { data, error } = await supabase
      .from('meal_foods')
      .insert({
        meal_id: mealId,
        food_item_id: foodId,
        quantity_grams: quantity
      })
      .select(`
        *,
        food_items (
          name,
          calories_per_100g,
          protein_g,
          carbs_g,
          fat_g
        )
      `)
      .single();

    if (error) {
      console.error('Error adding food to meal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in addFoodToMeal:', error);
    return { data: null, error };
  }
};

/**
 * Updates food quantity in meal
 * @param {number} mealFoodId - The meal food ID
 * @param {number} quantity - New quantity in grams
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateFoodInMeal = async (mealFoodId, quantity) => {
  try {
    const { data, error } = await supabase
      .from('meal_foods')
      .update({ quantity_grams: quantity })
      .eq('id', mealFoodId)
      .select(`
        *,
        food_items (
          name,
          calories_per_100g,
          protein_g,
          carbs_g,
          fat_g
        )
      `)
      .single();

    if (error) {
      console.error('Error updating food in meal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in updateFoodInMeal:', error);
    return { data: null, error };
  }
};

/**
 * Removes food from meal
 * @param {number} mealFoodId - The meal food ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const removeFoodFromMeal = async (mealFoodId) => {
  try {
    const { data, error } = await supabase
      .from('meal_foods')
      .delete()
      .eq('id', mealFoodId)
      .select()
      .single();

    if (error) {
      console.error('Error removing food from meal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in removeFoodFromMeal:', error);
    return { data: null, error };
  }
};

/**
 * Gets user nutrition goals
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getUserNutritionGoals = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('nutrition_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching nutrition goals:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getUserNutritionGoals:', error);
    return { data: null, error };
  }
};

/**
 * Creates or updates nutrition goal
 * @param {string} userId - The user ID
 * @param {Object} goalData - Goal data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const upsertNutritionGoal = async (userId, goalData) => {
  try {
    const { data, error } = await supabase
      .from('nutrition_goals')
      .upsert({
        user_id: userId,
        ...goalData
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting nutrition goal:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in upsertNutritionGoal:', error);
    return { data: null, error };
  }
};

/**
 * Gets water intake for user
 * @param {string} userId - The user ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getWaterIntake = async (userId, startDate, endDate) => {
  try {
    const { data, error } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching water intake:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getWaterIntake:', error);
    return { data: null, error };
  }
};

/**
 * Logs water intake for a date
 * @param {string} userId - The user ID
 * @param {string} date - Date (YYYY-MM-DD)
 * @param {number} amountMl - Amount in milliliters
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const logWaterIntake = async (userId, date, amountMl) => {
  try {
    const { data, error } = await supabase
      .from('water_intake')
      .upsert({
        user_id: userId,
        date,
        amount_ml: amountMl
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging water intake:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in logWaterIntake:', error);
    return { data: null, error };
  }
};

/**
 * Gets meal templates for user
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getMealTemplates = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('meal_templates')
      .select(`
        *,
        meal_template_foods (
          *,
          food_items (
            name,
            calories_per_100g,
            protein_g,
            carbs_g,
            fat_g
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching meal templates:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in getMealTemplates:', error);
    return { data: null, error };
  }
};

/**
 * Creates meal template
 * @param {string} userId - The user ID
 * @param {Object} templateData - Template data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createMealTemplate = async (userId, templateData) => {
  try {
    const { data, error } = await supabase
      .from('meal_templates')
      .insert({
        user_id: userId,
        ...templateData
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating meal template:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error in createMealTemplate:', error);
    return { data: null, error };
  }
};

/**
 * Creates meal from template
 * @param {string} userId - The user ID
 * @param {number} templateId - The template ID
 * @param {string} mealDate - The meal date (YYYY-MM-DD)
 * @param {string} mealType - Type of meal (breakfast, lunch, dinner, snack)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createMealFromTemplate = async (userId, templateId, mealDate, mealType) => {
  try {
    // Get template with foods
    const { data: template, error: templateError } = await supabase
      .from('meal_templates')
      .select(`
        *,
        meal_template_foods (
          food_item_id,
          quantity_grams
        )
      `)
      .eq('id', templateId)
      .single();

    if (templateError) {
      console.error('Error fetching template:', templateError);
      return { data: null, error: templateError };
    }

    // Create meal
    const { data: meal, error: mealError } = await supabase
      .from('user_meals')
      .insert({
        user_id: userId,
        meal_date: mealDate,
        meal_type: mealType,
        meal_time: new Date().toISOString(),
        notes: template.notes,
        template_id: templateId
      })
      .select()
      .single();

    if (mealError) {
      console.error('Error creating meal from template:', mealError);
      return { data: null, error: mealError };
    }

    // Add foods from template
    if (template.meal_template_foods && template.meal_template_foods.length > 0) {
      const mealFoods = template.meal_template_foods.map(tf => ({
        meal_id: meal.id,
        food_item_id: tf.food_item_id,
        quantity_grams: tf.quantity_grams
      }));

      const { error: foodsError } = await supabase
        .from('meal_foods')
        .insert(mealFoods);

      if (foodsError) {
        console.error('Error adding foods from template:', foodsError);
        return { data: null, error: foodsError };
      }
    }

    return { data: meal, error: null };
  } catch (error) {
    console.error('Unexpected error in createMealFromTemplate:', error);
    return { data: null, error };
  }
};

/**
 * Gets nutrition summary for a date range
 * @param {string} userId - The user ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const getNutritionSummary = async (userId, startDate, endDate) => {
  try {
    // Get meals with foods
    const { data: meals } = await getUserMeals(userId, startDate, endDate);
    
    // Get nutrition goals
    const { data: goals } = await getUserNutritionGoals(userId);
    
    // Get water intake
    const { data: waterIntake } = await getWaterIntake(userId, startDate, endDate);

    // Calculate nutrition totals
    const summary = {
      period: `${startDate} to ${endDate}`,
      totals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0
      },
      goals: goals?.[0] || null,
      waterIntake: waterIntake?.reduce((sum, w) => sum + (w.amount_ml || 0), 0) || 0,
      mealBreakdown: {
        breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
        snack: { calories: 0, protein: 0, carbs: 0, fat: 0 }
      }
    };

    if (meals) {
      meals.forEach(meal => {
        meal.meal_foods?.forEach(mf => {
          const food = mf.food_items;
          const quantity = mf.quantity_grams || 0;
          const factor = quantity / 100; // Convert per 100g to actual quantity

          const calories = (food.calories_per_100g || 0) * factor;
          const protein = (food.protein_g || 0) * factor;
          const carbs = (food.carbs_g || 0) * factor;
          const fat = (food.fat_g || 0) * factor;
          const fiber = (food.fiber_g || 0) * factor;
          const sugar = (food.sugar_g || 0) * factor;

          // Add to totals
          summary.totals.calories += calories;
          summary.totals.protein += protein;
          summary.totals.carbs += carbs;
          summary.totals.fat += fat;
          summary.totals.fiber += fiber;
          summary.totals.sugar += sugar;

          // Add to meal breakdown
          const mealType = meal.meal_type || 'snack';
          if (summary.mealBreakdown[mealType]) {
            summary.mealBreakdown[mealType].calories += calories;
            summary.mealBreakdown[mealType].protein += protein;
            summary.mealBreakdown[mealType].carbs += carbs;
            summary.mealBreakdown[mealType].fat += fat;
          }
        });
      });
    }

    // Round values
    Object.keys(summary.totals).forEach(key => {
      summary.totals[key] = Math.round(summary.totals[key] * 10) / 10;
    });

    Object.keys(summary.mealBreakdown).forEach(mealType => {
      Object.keys(summary.mealBreakdown[mealType]).forEach(nutrient => {
        summary.mealBreakdown[mealType][nutrient] = Math.round(summary.mealBreakdown[mealType][nutrient] * 10) / 10;
      });
    });

    return { data: summary, error: null };
  } catch (error) {
    console.error('Unexpected error in getNutritionSummary:', error);
    return { data: null, error };
  }
}; 