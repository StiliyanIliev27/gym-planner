-- Migration: Nutrition System
-- Ticket 1.4: Nutrition Schema

-- Create food_categories table for organization
CREATE TABLE IF NOT EXISTS food_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES food_categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create comprehensive food_items table (nutrition database)
CREATE TABLE IF NOT EXISTS food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic food information
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT, -- UPC/EAN for scanning
  description TEXT,
  
  -- Categorization
  category_id UUID REFERENCES food_categories(id),
  food_group TEXT, -- 'protein', 'carbs', 'fats', 'vegetables', 'fruits', 'dairy', 'grains'
  
  -- Serving information (per 100g unless specified)
  serving_size_g DECIMAL(8,2) DEFAULT 100,
  serving_size_description TEXT, -- '1 cup', '1 slice', etc.
  
  -- Macronutrients (per serving)
  calories DECIMAL(7,2) NOT NULL CHECK (calories >= 0),
  protein_g DECIMAL(6,2) DEFAULT 0 CHECK (protein_g >= 0),
  carbs_g DECIMAL(6,2) DEFAULT 0 CHECK (carbs_g >= 0),
  fat_g DECIMAL(6,2) DEFAULT 0 CHECK (fat_g >= 0),
  fiber_g DECIMAL(6,2) DEFAULT 0 CHECK (fiber_g >= 0),
  sugar_g DECIMAL(6,2) DEFAULT 0 CHECK (sugar_g >= 0),
  sodium_mg DECIMAL(8,2) DEFAULT 0 CHECK (sodium_mg >= 0),
  
  -- Micronutrients (optional, per serving)
  vitamin_a_mcg DECIMAL(8,2),
  vitamin_c_mg DECIMAL(8,2),
  vitamin_d_mcg DECIMAL(8,2),
  vitamin_e_mg DECIMAL(8,2),
  calcium_mg DECIMAL(8,2),
  iron_mg DECIMAL(8,2),
  potassium_mg DECIMAL(8,2),
  magnesium_mg DECIMAL(8,2),
  
  -- Food properties
  is_verified BOOLEAN DEFAULT FALSE, -- Nutritionist verified
  is_generic BOOLEAN DEFAULT TRUE, -- Generic food vs branded
  glycemic_index INTEGER CHECK (glycemic_index >= 0 AND glycemic_index <= 100),
  
  -- Allergens and dietary info
  allergens TEXT[], -- Array of allergen names
  dietary_tags TEXT[], -- 'vegan', 'vegetarian', 'gluten_free', 'keto', 'paleo', etc.
  
  -- User and system data
  created_by UUID REFERENCES profiles(id), -- NULL for system foods
  is_public BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0, -- How often this food is logged
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create nutrition_goals table for user dietary targets
CREATE TABLE IF NOT EXISTS nutrition_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Goal period
  goal_type TEXT CHECK (goal_type IN ('daily', 'weekly')) DEFAULT 'daily',
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Caloric goals
  calories_target INTEGER CHECK (calories_target > 0),
  calories_min INTEGER CHECK (calories_min > 0),
  calories_max INTEGER CHECK (calories_max > calories_min),
  
  -- Macronutrient goals (grams)
  protein_target_g DECIMAL(6,2) CHECK (protein_target_g >= 0),
  carbs_target_g DECIMAL(6,2) CHECK (carbs_target_g >= 0),
  fat_target_g DECIMAL(6,2) CHECK (fat_target_g >= 0),
  fiber_target_g DECIMAL(6,2) CHECK (fiber_target_g >= 0),
  
  -- Macronutrient percentages (alternative to grams)
  protein_percentage DECIMAL(4,1) CHECK (protein_percentage >= 0 AND protein_percentage <= 100),
  carbs_percentage DECIMAL(4,1) CHECK (carbs_percentage >= 0 AND carbs_percentage <= 100),
  fat_percentage DECIMAL(4,1) CHECK (fat_percentage >= 0 AND fat_percentage <= 100),
  
  -- Hydration goals
  water_target_liters DECIMAL(4,2) CHECK (water_target_liters > 0) DEFAULT 2.5,
  
  -- Meal distribution (percentages)
  breakfast_percentage DECIMAL(4,1) DEFAULT 25.0,
  lunch_percentage DECIMAL(4,1) DEFAULT 35.0,
  dinner_percentage DECIMAL(4,1) DEFAULT 30.0,
  snacks_percentage DECIMAL(4,1) DEFAULT 10.0,
  
  -- Goal status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create meal_templates table for reusable meal plans
CREATE TABLE IF NOT EXISTS meal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Template details
  name TEXT NOT NULL,
  description TEXT,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')) NOT NULL,
  
  -- Template properties
  estimated_prep_time_minutes INTEGER CHECK (estimated_prep_time_minutes >= 0),
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  cuisine_type TEXT,
  
  -- Nutritional summary (calculated from ingredients)
  total_calories DECIMAL(7,2) DEFAULT 0,
  total_protein_g DECIMAL(6,2) DEFAULT 0,
  total_carbs_g DECIMAL(6,2) DEFAULT 0,
  total_fat_g DECIMAL(6,2) DEFAULT 0,
  
  -- Template metadata
  servings INTEGER DEFAULT 1 CHECK (servings > 0),
  is_public BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  times_used INTEGER DEFAULT 0,
  
  -- Recipe information
  instructions TEXT,
  cooking_tips TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create meal_template_foods junction table
CREATE TABLE IF NOT EXISTS meal_template_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_template_id UUID NOT NULL REFERENCES meal_templates(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  
  -- Quantity information
  quantity DECIMAL(8,2) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL, -- 'g', 'ml', 'cups', 'pieces', etc.
  
  -- Optional preparation notes
  preparation_note TEXT, -- 'cooked', 'raw', 'chopped', etc.
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_meals table for actual meal logging
CREATE TABLE IF NOT EXISTS user_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES meal_templates(id), -- NULL for custom meals
  
  -- Meal details
  name TEXT NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout')) NOT NULL,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  consumed_at TIMESTAMP DEFAULT NOW(),
  
  -- Meal summary (calculated from foods)
  total_calories DECIMAL(7,2) DEFAULT 0,
  total_protein_g DECIMAL(6,2) DEFAULT 0,
  total_carbs_g DECIMAL(6,2) DEFAULT 0,
  total_fat_g DECIMAL(6,2) DEFAULT 0,
  total_fiber_g DECIMAL(6,2) DEFAULT 0,
  total_sodium_mg DECIMAL(8,2) DEFAULT 0,
  
  -- Meal context
  location TEXT, -- 'home', 'restaurant', 'work', etc.
  social_context TEXT, -- 'alone', 'family', 'friends', etc.
  notes TEXT,
  
  -- Meal satisfaction
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  hunger_before INTEGER CHECK (hunger_before >= 1 AND hunger_before <= 10),
  hunger_after INTEGER CHECK (hunger_after >= 1 AND hunger_after <= 10),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create meal_foods junction table for actual food consumption
CREATE TABLE IF NOT EXISTS meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES user_meals(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  
  -- Consumption details
  quantity DECIMAL(8,2) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  
  -- Nutritional contribution (calculated)
  calories_contributed DECIMAL(7,2) DEFAULT 0,
  protein_contributed_g DECIMAL(6,2) DEFAULT 0,
  carbs_contributed_g DECIMAL(6,2) DEFAULT 0,
  fat_contributed_g DECIMAL(6,2) DEFAULT 0,
  
  -- Optional notes
  preparation_note TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create water_intake table for hydration tracking
CREATE TABLE IF NOT EXISTS water_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Intake details
  intake_date DATE NOT NULL DEFAULT CURRENT_DATE,
  consumed_at TIMESTAMP DEFAULT NOW(),
  amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
  
  -- Source type
  source_type TEXT CHECK (source_type IN ('water', 'tea', 'coffee', 'juice', 'sports_drink', 'other')) DEFAULT 'water',
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create recipe_steps table for detailed cooking instructions
CREATE TABLE IF NOT EXISTS recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_template_id UUID NOT NULL REFERENCES meal_templates(id) ON DELETE CASCADE,
  
  -- Step details
  step_number INTEGER NOT NULL CHECK (step_number > 0),
  instruction TEXT NOT NULL,
  estimated_time_minutes INTEGER CHECK (estimated_time_minutes >= 0),
  
  -- Optional media
  image_url TEXT,
  video_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(meal_template_id, step_number)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_food_items_name ON food_items(name);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_food_items_barcode ON food_items(barcode);
CREATE INDEX IF NOT EXISTS idx_food_items_public ON food_items(is_public);

CREATE INDEX IF NOT EXISTS idx_nutrition_goals_user_active ON nutrition_goals(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_meal_templates_user ON meal_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_meal_templates_type ON meal_templates(meal_type);

CREATE INDEX IF NOT EXISTS idx_user_meals_user_date ON user_meals(user_id, meal_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_meals_type ON user_meals(user_id, meal_type);
CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON water_intake(user_id, intake_date DESC);

-- Add updated_at triggers
CREATE TRIGGER update_food_items_updated_at 
  BEFORE UPDATE ON food_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_goals_updated_at 
  BEFORE UPDATE ON nutrition_goals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_templates_updated_at 
  BEFORE UPDATE ON meal_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_meals_updated_at 
  BEFORE UPDATE ON user_meals 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_template_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for food_items
CREATE POLICY "Anyone can view public food items" ON food_items
  FOR SELECT USING (is_public = true OR created_by = auth.uid() OR created_by IS NULL);

CREATE POLICY "Users can create custom food items" ON food_items
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their custom food items" ON food_items
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for nutrition_goals
CREATE POLICY "Users can manage their own nutrition goals" ON nutrition_goals
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for meal_templates
CREATE POLICY "Users can view public templates and their own" ON meal_templates
  FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own meal templates" ON meal_templates
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own meal templates" ON meal_templates
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own meal templates" ON meal_templates
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for meal_template_foods
CREATE POLICY "Users can view template foods they have access to" ON meal_template_foods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meal_templates mt 
      WHERE mt.id = meal_template_id 
      AND (mt.is_public = true OR mt.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage their template foods" ON meal_template_foods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meal_templates mt 
      WHERE mt.id = meal_template_id 
      AND mt.created_by = auth.uid()
    )
  );

-- RLS Policies for user_meals
CREATE POLICY "Users can manage their own meals" ON user_meals
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for meal_foods
CREATE POLICY "Users can manage their meal foods" ON meal_foods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_meals um 
      WHERE um.id = meal_id 
      AND um.user_id = auth.uid()
    )
  );

-- RLS Policies for water_intake
CREATE POLICY "Users can manage their own water intake" ON water_intake
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for recipe_steps
CREATE POLICY "Users can view recipe steps they have access to" ON recipe_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meal_templates mt 
      WHERE mt.id = meal_template_id 
      AND (mt.is_public = true OR mt.created_by = auth.uid())
    )
  );

CREATE POLICY "Users can manage their recipe steps" ON recipe_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM meal_templates mt 
      WHERE mt.id = meal_template_id 
      AND mt.created_by = auth.uid()
    )
  );

-- Public read access to food categories
ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view food categories" ON food_categories
  FOR SELECT USING (true);

-- Insert basic food categories
INSERT INTO food_categories (name, description) VALUES
('Proteins', 'Meat, fish, eggs, and protein sources'),
('Dairy', 'Milk, cheese, yogurt, and dairy products'),
('Grains', 'Bread, rice, pasta, and grain products'),
('Vegetables', 'Fresh and cooked vegetables'),
('Fruits', 'Fresh and dried fruits'),
('Nuts & Seeds', 'Nuts, seeds, and nut products'),
('Oils & Fats', 'Cooking oils, butter, and fat sources'),
('Beverages', 'Drinks and liquid refreshments'),
('Snacks', 'Processed snack foods'),
('Condiments', 'Sauces, spices, and flavor enhancers'),
('Supplements', 'Protein powders and nutritional supplements'),
('Prepared Foods', 'Ready-made and restaurant foods')
ON CONFLICT (name) DO NOTHING;

-- Insert some basic food items for testing
INSERT INTO food_items (name, category_id, calories, protein_g, carbs_g, fat_g, fiber_g, food_group, dietary_tags) 
SELECT 
  'Chicken Breast (Raw)',
  c.id,
  165,
  31.0,
  0,
  3.6,
  0,
  'protein',
  ARRAY['high_protein', 'low_carb']
FROM food_categories c WHERE c.name = 'Proteins'
ON CONFLICT DO NOTHING;

INSERT INTO food_items (name, category_id, calories, protein_g, carbs_g, fat_g, fiber_g, food_group, dietary_tags)
SELECT 
  'Brown Rice (Cooked)',
  c.id,
  123,
  2.3,
  23.0,
  0.9,
  1.8,
  'carbs',
  ARRAY['whole_grain', 'gluten_free']
FROM food_categories c WHERE c.name = 'Grains'
ON CONFLICT DO NOTHING;

INSERT INTO food_items (name, category_id, calories, protein_g, carbs_g, fat_g, fiber_g, food_group, dietary_tags)
SELECT 
  'Broccoli (Cooked)',
  c.id,
  35,
  2.4,
  7.2,
  0.4,
  3.3,
  'vegetables',
  ARRAY['low_calorie', 'high_fiber', 'vegan']
FROM food_categories c WHERE c.name = 'Vegetables'
ON CONFLICT DO NOTHING; 