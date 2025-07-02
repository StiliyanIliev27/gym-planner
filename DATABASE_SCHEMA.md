# GymPlanner Database Schema

## Преглед
Базата данни на GymPlanner е построена върху PostgreSQL с Supabase и включва пълна система за фитнес управление с потребителски профили, тренировки, упражнения, проследяване на прогреса и хранене.

## Основни Модули

### 1. 👤 Потребители и Профили (Authentication & Profiles)

#### `profiles`
Основна таблица за потребителските профили, свързана с Supabase Auth.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm INTEGER CHECK (height_cm > 0 AND height_cm < 300),
  weight_kg DECIMAL(5,2) CHECK (weight_kg > 0),
  activity_level TEXT DEFAULT 'moderately_active',
  fitness_goals TEXT CHECK (fitness_goals IN ('weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness')),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  units_system TEXT DEFAULT 'metric',
  confirmation_code TEXT,
  confirmation_expires_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_goals`
Фитнес цели на потребителите.

```sql
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  goal_type TEXT CHECK (goal_type IN ('weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness', 'body_recomposition')),
  target_weight_kg DECIMAL(5,2),
  target_body_fat_percentage DECIMAL(4,2),
  target_date DATE,
  weekly_workout_frequency INTEGER DEFAULT 3,
  daily_calorie_goal INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_preferences`
Настройки на приложението за всеки потребител.

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id),
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  workout_reminders BOOLEAN DEFAULT TRUE,
  -- App preferences
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  start_week_on TEXT DEFAULT 'monday',
  -- Privacy settings
  public_profile BOOLEAN DEFAULT FALSE,
  share_workouts BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 2. 💪 Система за Тренировки и Упражнения (Workout & Exercise System)

#### `muscle_groups`
Мускулни групи за категоризиране на упражненията.

```sql
CREATE TABLE muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `equipment`
Оборудване необходимо за упражненията.

```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT, -- 'free_weights', 'machines', 'cardio', 'bodyweight', 'accessories'
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `exercises`
Основна таблица за всички упражнения в системата.

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  exercise_type TEXT DEFAULT 'strength',
  -- Muscle targeting
  primary_muscle_groups TEXT[], -- Array of muscle group names
  secondary_muscle_groups TEXT[], 
  -- Exercise mechanics
  movement_pattern TEXT, -- 'push', 'pull', 'squat', 'hinge', 'lunge', 'core', 'carry'
  equipment_needed TEXT[], -- Array of equipment names
  -- Media and AI features
  demo_video_url TEXT,
  demo_image_url TEXT,
  video_urls TEXT[], -- Multiple videos
  image_urls TEXT[], -- Multiple images
  tips TEXT,
  form_cues TEXT[], -- AI-generated form cues
  common_mistakes TEXT[], -- Common mistakes to avoid
  progressions TEXT[], -- Exercise progressions
  regressions TEXT[], -- Exercise regressions
  ai_tags TEXT[], -- AI-generated tags
  ai_difficulty_score DECIMAL(3,2),
  -- Properties
  is_compound BOOLEAN DEFAULT FALSE,
  is_bilateral BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `workout_templates`
Шаблони за тренировки, които могат да се използват многократно.

```sql
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  estimated_duration_minutes INTEGER,
  -- Categorization
  workout_type TEXT[], -- 'strength', 'cardio', 'flexibility', 'hiit', 'circuit'
  target_muscle_groups TEXT[],
  equipment_needed TEXT[],
  -- Properties
  is_public BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `workout_template_exercises`
Връзка между шаблони и упражнения.

```sql
CREATE TABLE workout_template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_template_id UUID NOT NULL REFERENCES workout_templates(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL,
  superset_group INTEGER,
  -- Default parameters
  default_sets INTEGER,
  default_reps_min INTEGER,
  default_reps_max INTEGER,
  default_weight_kg DECIMAL(6,2),
  default_duration_seconds INTEGER,
  default_rest_seconds INTEGER DEFAULT 60,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_workouts`
Действителни тренировки на потребителите.

```sql
CREATE TABLE user_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  template_id UUID REFERENCES workout_templates(id),
  name TEXT NOT NULL,
  workout_date DATE DEFAULT CURRENT_DATE,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  -- Session metrics
  total_duration_minutes INTEGER,
  total_volume_kg DECIMAL(10,2) DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  estimated_calories_burned INTEGER,
  -- AI and media enhancements
  cover_image_url TEXT,
  ai_generated_notes TEXT,
  ai_suggestions TEXT[],
  difficulty_rating INTEGER,
  workout_tags TEXT[],
  -- Session feedback
  notes TEXT,
  perceived_exertion INTEGER, -- RPE scale 1-10
  session_rating INTEGER, -- 1-5 stars
  status TEXT DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'skipped'
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `workout_exercises`
Упражнения в конкретна тренировка.

```sql
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES user_workouts(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL,
  superset_group INTEGER,
  is_completed BOOLEAN DEFAULT FALSE,
  skipped_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `exercise_sets`
Индивидуални сетове за всяко упражнение.

```sql
CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id),
  set_number INTEGER NOT NULL,
  set_type TEXT DEFAULT 'working', -- 'working', 'warmup', 'dropset', 'restpause', 'failure'
  -- Performance metrics
  reps INTEGER,
  weight_kg DECIMAL(6,2),
  duration_seconds INTEGER,
  distance_meters DECIMAL(8,2),
  rest_duration_seconds INTEGER,
  -- Completion tracking
  is_completed BOOLEAN DEFAULT FALSE,
  rpe INTEGER, -- Rate of Perceived Exertion 1-10
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 3. 📊 Проследяване на Прогреса (Progress Tracking)

#### `user_measurements`
Телесни измервания и състав на тялото.

```sql
CREATE TABLE user_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  measurement_date DATE DEFAULT CURRENT_DATE,
  measured_at TIMESTAMP DEFAULT NOW(),
  -- Body composition
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  muscle_mass_kg DECIMAL(5,2),
  water_percentage DECIMAL(4,2),
  bone_mass_kg DECIMAL(4,2),
  visceral_fat_rating INTEGER,
  -- Body measurements (cm)
  neck_cm DECIMAL(4,1),
  chest_cm DECIMAL(4,1),
  waist_cm DECIMAL(4,1),
  hips_cm DECIMAL(4,1),
  bicep_left_cm DECIMAL(4,1),
  bicep_right_cm DECIMAL(4,1),
  thigh_left_cm DECIMAL(4,1),
  thigh_right_cm DECIMAL(4,1),
  calf_left_cm DECIMAL(4,1),
  calf_right_cm DECIMAL(4,1),
  -- Context
  measurement_type TEXT DEFAULT 'manual',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `progress_photos`
Визуално проследяване с снимки.

```sql
CREATE TABLE progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL, -- 'front', 'back', 'side_left', 'side_right', 'custom'
  photo_date DATE DEFAULT CURRENT_DATE,
  measurement_id UUID REFERENCES user_measurements(id),
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `daily_stats`
Ежедневна статистика за активност и здраве.

```sql
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  date DATE DEFAULT CURRENT_DATE,
  -- Activity metrics
  steps_count INTEGER DEFAULT 0,
  calories_burned INTEGER DEFAULT 0,
  active_minutes INTEGER DEFAULT 0,
  distance_km DECIMAL(6,2) DEFAULT 0,
  -- Nutrition tracking
  calories_consumed INTEGER,
  protein_grams DECIMAL(6,2),
  carbs_grams DECIMAL(6,2),
  fat_grams DECIMAL(6,2),
  water_liters DECIMAL(4,2),
  -- Wellness metrics
  sleep_hours DECIMAL(3,1),
  sleep_quality INTEGER, -- 1-5
  stress_level INTEGER, -- 1-10
  energy_level INTEGER, -- 1-10
  mood_rating INTEGER, -- 1-10
  -- Recovery metrics
  resting_heart_rate INTEGER,
  hrv_score INTEGER,
  recovery_score INTEGER, -- 0-100
  -- Workout summary
  workouts_completed INTEGER DEFAULT 0,
  total_workout_duration_minutes INTEGER DEFAULT 0,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### `exercise_personal_records`
Лични рекорди за сила и издръжливост.

```sql
CREATE TABLE exercise_personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  record_type TEXT NOT NULL, -- '1rm', '3rm', '5rm', 'max_reps', 'max_weight', 'max_volume'
  -- Record values
  weight_kg DECIMAL(6,2),
  reps INTEGER,
  duration_seconds INTEGER,
  distance_meters DECIMAL(8,2),
  volume_kg DECIMAL(10,2),
  -- Context
  set_id UUID REFERENCES exercise_sets(id),
  workout_id UUID REFERENCES user_workouts(id),
  achieved_date DATE DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, exercise_id, record_type)
);
```

#### `achievement_definitions` & `user_achievements`
Система за постижения и геймификация.

```sql
CREATE TABLE achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'workout', 'consistency', 'strength', 'endurance', etc.
  requirement_type TEXT NOT NULL,
  requirement_value DECIMAL(10,2),
  requirement_timeframe_days INTEGER,
  points INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common',
  icon_url TEXT,
  badge_color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  achievement_id UUID NOT NULL REFERENCES achievement_definitions(id),
  progress_value DECIMAL(10,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  related_workout_id UUID REFERENCES user_workouts(id),
  related_measurement_id UUID REFERENCES user_measurements(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

#### `progress_milestones`
Целеви етапи за проследяване на прогреса.

```sql
CREATE TABLE progress_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  goal_id UUID REFERENCES user_goals(id),
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  metric_type TEXT NOT NULL, -- 'weight', 'body_fat', 'muscle_mass', 'strength', etc.
  target_date DATE,
  achieved_date DATE,
  is_achieved BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 3, -- 1-5
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 4. 🍎 Система за Хранене (Nutrition System)

#### `food_categories`
Категории храни за организация.

```sql
CREATE TABLE food_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_category_id UUID REFERENCES food_categories(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `food_items`
База данни с храни и хранителни стойности.

```sql
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT, -- UPC/EAN for scanning
  description TEXT,
  category_id UUID REFERENCES food_categories(id),
  food_group TEXT, -- 'protein', 'carbs', 'fats', 'vegetables', etc.
  -- Serving information
  serving_size_g DECIMAL(8,2) DEFAULT 100,
  serving_size_description TEXT,
  -- Macronutrients per serving
  calories DECIMAL(7,2) NOT NULL,
  protein_g DECIMAL(6,2) DEFAULT 0,
  carbs_g DECIMAL(6,2) DEFAULT 0,
  fat_g DECIMAL(6,2) DEFAULT 0,
  fiber_g DECIMAL(6,2) DEFAULT 0,
  sugar_g DECIMAL(6,2) DEFAULT 0,
  sodium_mg DECIMAL(8,2) DEFAULT 0,
  -- Micronutrients (optional)
  vitamin_a_mcg DECIMAL(8,2),
  vitamin_c_mg DECIMAL(8,2),
  vitamin_d_mcg DECIMAL(8,2),
  calcium_mg DECIMAL(8,2),
  iron_mg DECIMAL(8,2),
  potassium_mg DECIMAL(8,2),
  magnesium_mg DECIMAL(8,2),
  -- Properties
  is_verified BOOLEAN DEFAULT FALSE,
  is_generic BOOLEAN DEFAULT TRUE,
  glycemic_index INTEGER,
  allergens TEXT[],
  dietary_tags TEXT[], -- 'vegan', 'vegetarian', 'gluten_free', etc.
  created_by UUID REFERENCES profiles(id),
  is_public BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `nutrition_goals`
Хранителни цели на потребителите.

```sql
CREATE TABLE nutrition_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  goal_type TEXT DEFAULT 'daily',
  effective_date DATE DEFAULT CURRENT_DATE,
  -- Caloric goals
  calories_target INTEGER,
  calories_min INTEGER,
  calories_max INTEGER,
  -- Macronutrient goals
  protein_target_g DECIMAL(6,2),
  carbs_target_g DECIMAL(6,2),
  fat_target_g DECIMAL(6,2),
  fiber_target_g DECIMAL(6,2),
  -- Alternative: percentages
  protein_percentage DECIMAL(4,1),
  carbs_percentage DECIMAL(4,1),
  fat_percentage DECIMAL(4,1),
  -- Hydration
  water_target_liters DECIMAL(4,2) DEFAULT 2.5,
  -- Meal distribution
  breakfast_percentage DECIMAL(4,1) DEFAULT 25.0,
  lunch_percentage DECIMAL(4,1) DEFAULT 35.0,
  dinner_percentage DECIMAL(4,1) DEFAULT 30.0,
  snacks_percentage DECIMAL(4,1) DEFAULT 10.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `meal_templates`
Шаблони за хранене, които могат да се използват многократно.

```sql
CREATE TABLE meal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'
  estimated_prep_time_minutes INTEGER,
  difficulty_level TEXT DEFAULT 'easy',
  cuisine_type TEXT,
  -- Nutritional summary
  total_calories DECIMAL(7,2) DEFAULT 0,
  total_protein_g DECIMAL(6,2) DEFAULT 0,
  total_carbs_g DECIMAL(6,2) DEFAULT 0,
  total_fat_g DECIMAL(6,2) DEFAULT 0,
  servings INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  times_used INTEGER DEFAULT 0,
  instructions TEXT,
  cooking_tips TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `meal_template_foods`
Връзка между шаблони за хранене и храни.

```sql
CREATE TABLE meal_template_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_template_id UUID NOT NULL REFERENCES meal_templates(id),
  food_item_id UUID NOT NULL REFERENCES food_items(id),
  quantity DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  preparation_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `user_meals`
Действителни хранения на потребителите.

```sql
CREATE TABLE user_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  template_id UUID REFERENCES meal_templates(id),
  name TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  meal_date DATE DEFAULT CURRENT_DATE,
  consumed_at TIMESTAMP DEFAULT NOW(),
  -- Nutritional summary
  total_calories DECIMAL(7,2) DEFAULT 0,
  total_protein_g DECIMAL(6,2) DEFAULT 0,
  total_carbs_g DECIMAL(6,2) DEFAULT 0,
  total_fat_g DECIMAL(6,2) DEFAULT 0,
  total_fiber_g DECIMAL(6,2) DEFAULT 0,
  total_sodium_mg DECIMAL(8,2) DEFAULT 0,
  -- Context
  location TEXT,
  social_context TEXT,
  notes TEXT,
  -- Satisfaction tracking
  satisfaction_rating INTEGER, -- 1-5
  hunger_before INTEGER, -- 1-10
  hunger_after INTEGER, -- 1-10
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `meal_foods`
Връзка между хранения и храни.

```sql
CREATE TABLE meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES user_meals(id),
  food_item_id UUID NOT NULL REFERENCES food_items(id),
  quantity DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  -- Calculated nutritional contribution
  calories_contributed DECIMAL(7,2) DEFAULT 0,
  protein_contributed_g DECIMAL(6,2) DEFAULT 0,
  carbs_contributed_g DECIMAL(6,2) DEFAULT 0,
  fat_contributed_g DECIMAL(6,2) DEFAULT 0,
  preparation_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `water_intake`
Проследяване на хидратацията.

```sql
CREATE TABLE water_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  intake_date DATE DEFAULT CURRENT_DATE,
  consumed_at TIMESTAMP DEFAULT NOW(),
  amount_ml INTEGER NOT NULL,
  source_type TEXT DEFAULT 'water', -- 'water', 'tea', 'coffee', 'juice', etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `recipe_steps`
Детайлни инструкции за готвене.

```sql
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_template_id UUID NOT NULL REFERENCES meal_templates(id),
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  estimated_time_minutes INTEGER,
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(meal_template_id, step_number)
);
```

---

## 🔐 Row Level Security (RLS)

Всички таблици са защитени с RLS политики, които гарантират, че потребителите могат да достъпват само своите данни:

- **Профили**: Потребителите могат да виждат и редактират само своите профили
- **Тренировки**: Достъп до собствени тренировки + публични шаблони
- **Упражнения**: Публични упражнения + собствени персонализирани
- **Прогрес**: Само собствени данни за прогрес
- **Хранене**: Собствени данни + публични храни и рецепти

## 📁 Storage Buckets

Системата използва Supabase Storage за медийни файлове:

- **exercise-media**: Видеа и снимки за упражнения (52MB лимит)
- **workout-covers**: Корици за тренировки (10MB лимит)

## 🔍 Индекси за Производителност

Ключови индекси за бърз достъп до данните:

```sql
-- User-based indexes
CREATE INDEX idx_user_workouts_user_date ON user_workouts(user_id, workout_date DESC);
CREATE INDEX idx_user_measurements_user_date ON user_measurements(user_id, measurement_date DESC);
CREATE INDEX idx_user_meals_user_date ON user_meals(user_id, meal_date DESC);

-- Search indexes  
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_food_items_name ON food_items(name);
CREATE INDEX idx_food_items_barcode ON food_items(barcode);

-- Array indexes for tags and categories
CREATE INDEX idx_exercises_muscle_groups ON exercises USING GIN(primary_muscle_groups);
CREATE INDEX idx_exercises_ai_tags ON exercises USING GIN(ai_tags);
CREATE INDEX idx_food_items_dietary_tags ON food_items USING GIN(dietary_tags);
```

## ⚡ Тригери за Автоматично Обновяване

Автоматично обновяване на `updated_at` за всички основни таблици:

```sql
CREATE TRIGGER update_[table]_updated_at 
  BEFORE UPDATE ON [table] 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 📊 Примерни Заявки

### Топ 10 най-използвани упражнения
```sql
SELECT e.name, COUNT(we.id) as usage_count
FROM exercises e
JOIN workout_exercises we ON e.id = we.exercise_id
GROUP BY e.id, e.name
ORDER BY usage_count DESC
LIMIT 10;
```

### Среден прогрес за загуба на тегло за последните 30 дни
```sql
SELECT AVG(weight_kg) as avg_weight
FROM user_measurements 
WHERE user_id = $1 
AND measurement_date >= CURRENT_DATE - INTERVAL '30 days';
```

### Седмично разпределение на тренировките
```sql
SELECT 
  EXTRACT(dow FROM workout_date) as day_of_week,
  COUNT(*) as workout_count
FROM user_workouts 
WHERE user_id = $1 
AND status = 'completed'
GROUP BY day_of_week
ORDER BY day_of_week;
```

---

*Този документ е актуализиран към юли 2025 г. и отразява пълната схема на базата данни GymPlanner.*