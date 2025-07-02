# GymPlanner Database Structure

## Основни модули

### 1. Потребители и Профили
- profiles
- user_goals  
- user_preferences

### 2. Тренировки и Упражнения
- exercises
- muscle_groups
- equipment
- workout_templates
- user_workouts
- workout_exercises
- exercise_sets

### 3. Проследяване на прогреса
- user_measurements
- progress_photos
- daily_stats
- exercise_personal_records
- achievement_definitions
- user_achievements
- progress_milestones

### 4. Хранене
- food_items
- food_categories  
- nutrition_goals
- meal_templates
- user_meals
- meal_foods
- water_intake
- recipe_steps

## Детайлна структура на таблиците

### 1. Потребители и Профили

#### profiles
Основна таблица за потребителски профили
```sql
id UUID PRIMARY KEY (REFERENCES auth.users)
first_name TEXT
last_name TEXT
full_name TEXT
avatar_url TEXT
date_of_birth DATE
gender TEXT CHECK (male/female/other/prefer_not_to_say)
height_cm INTEGER CHECK (0-300)
weight_kg DECIMAL(5,2)
activity_level TEXT (sedentary/lightly_active/moderately_active/very_active/extremely_active)
fitness_goals TEXT (weight_loss/muscle_gain/strength/endurance/general_fitness)
experience_level TEXT (beginner/intermediate/advanced)
bio TEXT
timezone TEXT DEFAULT 'UTC'
units_system TEXT (metric/imperial) DEFAULT 'metric'
confirmation_code TEXT
is_verified BOOLEAN DEFAULT FALSE
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### user_goals
Фитнес цели на потребителите
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
goal_type TEXT (weight_loss/muscle_gain/strength/endurance/general_fitness/body_recomposition)
target_weight_kg DECIMAL(5,2)
target_body_fat_percentage DECIMAL(4,2)
target_date DATE
weekly_workout_frequency INTEGER (0-14) DEFAULT 3
daily_calorie_goal INTEGER
is_active BOOLEAN DEFAULT TRUE
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### user_preferences
Настройки на приложението
```sql
id UUID PRIMARY KEY
user_id UUID UNIQUE REFERENCES profiles(id)
email_notifications BOOLEAN DEFAULT TRUE
push_notifications BOOLEAN DEFAULT TRUE
workout_reminders BOOLEAN DEFAULT TRUE
progress_updates BOOLEAN DEFAULT TRUE
achievement_notifications BOOLEAN DEFAULT TRUE
theme TEXT (light/dark/system) DEFAULT 'system'
language TEXT DEFAULT 'en'
start_week_on TEXT (monday/sunday) DEFAULT 'monday'
public_profile BOOLEAN DEFAULT FALSE
share_workouts BOOLEAN DEFAULT FALSE
share_progress BOOLEAN DEFAULT FALSE
created_at TIMESTAMP
updated_at TIMESTAMP
```

### 2. Тренировки и Упражнения

#### exercises
База данни с упражнения
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
description TEXT
instructions TEXT
difficulty_level TEXT (beginner/intermediate/advanced) DEFAULT 'beginner'
exercise_type TEXT (strength/cardio/flexibility/balance/plyometric) DEFAULT 'strength'
primary_muscle_groups TEXT[] -- Array of muscle group names
secondary_muscle_groups TEXT[]
movement_pattern TEXT (push/pull/squat/hinge/lunge/core/carry)
equipment_needed TEXT[] -- Array of equipment names
demo_video_url TEXT
demo_image_url TEXT
video_urls TEXT[] -- Multiple videos
image_urls TEXT[] -- Multiple images
tips TEXT
form_cues TEXT[] -- AI-generated form cues
common_mistakes TEXT[] -- Common mistakes to avoid
progressions TEXT[] -- Exercise progressions
regressions TEXT[] -- Exercise regressions
ai_tags TEXT[] -- AI-generated tags
ai_difficulty_score DECIMAL(3,2) (0-10)
is_compound BOOLEAN DEFAULT FALSE
is_bilateral BOOLEAN DEFAULT TRUE
created_by UUID REFERENCES profiles(id)
is_public BOOLEAN DEFAULT TRUE
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### workout_templates
Шаблони за тренировки
```sql
id UUID PRIMARY KEY
created_by UUID REFERENCES profiles(id)
name TEXT NOT NULL
description TEXT
difficulty_level TEXT (beginner/intermediate/advanced) DEFAULT 'beginner'
estimated_duration_minutes INTEGER
workout_type TEXT[] -- strength/cardio/flexibility/hiit/circuit
target_muscle_groups TEXT[]
equipment_needed TEXT[]
is_public BOOLEAN DEFAULT FALSE
is_favorite BOOLEAN DEFAULT FALSE
times_used INTEGER DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### user_workouts
Действителни тренировки на потребителите
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
template_id UUID REFERENCES workout_templates(id)
name TEXT NOT NULL
workout_date DATE DEFAULT CURRENT_DATE
started_at TIMESTAMP
completed_at TIMESTAMP
total_duration_minutes INTEGER
total_volume_kg DECIMAL(10,2) DEFAULT 0
total_reps INTEGER DEFAULT 0
estimated_calories_burned INTEGER
cover_image_url TEXT
ai_generated_notes TEXT
ai_suggestions TEXT[]
difficulty_rating INTEGER (1-5)
workout_tags TEXT[]
notes TEXT
perceived_exertion INTEGER (1-10) -- RPE scale
session_rating INTEGER (1-5)
status TEXT (planned/in_progress/completed/skipped) DEFAULT 'planned'
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### exercise_sets
Индивидуални сетове за всяко упражнение
```sql
id UUID PRIMARY KEY
workout_exercise_id UUID REFERENCES workout_exercises(id)
set_number INTEGER NOT NULL
set_type TEXT (working/warmup/dropset/restpause/failure) DEFAULT 'working'
reps INTEGER
weight_kg DECIMAL(6,2)
duration_seconds INTEGER
distance_meters DECIMAL(8,2)
rest_duration_seconds INTEGER
is_completed BOOLEAN DEFAULT FALSE
rpe INTEGER (1-10) -- Rate of Perceived Exertion
started_at TIMESTAMP
completed_at TIMESTAMP
created_at TIMESTAMP
```

### 3. Проследяване на прогреса

#### user_measurements
Телесни измервания и състав на тялото
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
measurement_date DATE DEFAULT CURRENT_DATE
measured_at TIMESTAMP DEFAULT NOW()
weight_kg DECIMAL(5,2)
body_fat_percentage DECIMAL(4,2) (0-100)
muscle_mass_kg DECIMAL(5,2)
water_percentage DECIMAL(4,2) (0-100)
bone_mass_kg DECIMAL(4,2)
visceral_fat_rating INTEGER (1-60)
neck_cm DECIMAL(4,1)
chest_cm DECIMAL(4,1)
waist_cm DECIMAL(4,1)
hips_cm DECIMAL(4,1)
bicep_left_cm DECIMAL(4,1)
bicep_right_cm DECIMAL(4,1)
thigh_left_cm DECIMAL(4,1)
thigh_right_cm DECIMAL(4,1)
calf_left_cm DECIMAL(4,1)
calf_right_cm DECIMAL(4,1)
measurement_type TEXT (manual/scale/dexa/bodpod/calipers) DEFAULT 'manual'
notes TEXT
created_at TIMESTAMP
```

#### daily_stats
Ежедневна статистика за активност и здраве
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
date DATE DEFAULT CURRENT_DATE
steps_count INTEGER DEFAULT 0
calories_burned INTEGER DEFAULT 0
active_minutes INTEGER DEFAULT 0
distance_km DECIMAL(6,2) DEFAULT 0
calories_consumed INTEGER
protein_grams DECIMAL(6,2)
carbs_grams DECIMAL(6,2)
fat_grams DECIMAL(6,2)
fiber_grams DECIMAL(6,2)
water_liters DECIMAL(4,2)
sleep_hours DECIMAL(3,1) (0-24)
sleep_quality INTEGER (1-5)
stress_level INTEGER (1-10)
energy_level INTEGER (1-10)
mood_rating INTEGER (1-10)
resting_heart_rate INTEGER
hrv_score INTEGER
recovery_score INTEGER (0-100)
workouts_completed INTEGER DEFAULT 0
total_workout_duration_minutes INTEGER DEFAULT 0
notes TEXT
tags TEXT[]
created_at TIMESTAMP
updated_at TIMESTAMP
UNIQUE(user_id, date)
```

#### exercise_personal_records
Лични рекорди за сила и издръжливост
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
exercise_id UUID REFERENCES exercises(id)
record_type TEXT (1rm/3rm/5rm/max_reps/max_weight/max_volume/max_distance/max_duration)
weight_kg DECIMAL(6,2)
reps INTEGER
duration_seconds INTEGER
distance_meters DECIMAL(8,2)
volume_kg DECIMAL(10,2) -- weight * reps
set_id UUID REFERENCES exercise_sets(id)
workout_id UUID REFERENCES user_workouts(id)
achieved_date DATE DEFAULT CURRENT_DATE
is_verified BOOLEAN DEFAULT FALSE
notes TEXT
created_at TIMESTAMP
UNIQUE(user_id, exercise_id, record_type)
```

### 4. Хранене

#### food_items
База данни с храни и хранителни стойности
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
brand TEXT
barcode TEXT -- UPC/EAN for scanning
description TEXT
category_id UUID REFERENCES food_categories(id)
food_group TEXT (protein/carbs/fats/vegetables/fruits/dairy/grains)
serving_size_g DECIMAL(8,2) DEFAULT 100
serving_size_description TEXT -- '1 cup', '1 slice', etc.
calories DECIMAL(7,2) NOT NULL
protein_g DECIMAL(6,2) DEFAULT 0
carbs_g DECIMAL(6,2) DEFAULT 0
fat_g DECIMAL(6,2) DEFAULT 0
fiber_g DECIMAL(6,2) DEFAULT 0
sugar_g DECIMAL(6,2) DEFAULT 0
sodium_mg DECIMAL(8,2) DEFAULT 0
vitamin_a_mcg DECIMAL(8,2)
vitamin_c_mg DECIMAL(8,2)
vitamin_d_mcg DECIMAL(8,2)
calcium_mg DECIMAL(8,2)
iron_mg DECIMAL(8,2)
potassium_mg DECIMAL(8,2)
magnesium_mg DECIMAL(8,2)
is_verified BOOLEAN DEFAULT FALSE
is_generic BOOLEAN DEFAULT TRUE
glycemic_index INTEGER (0-100)
allergens TEXT[] -- Array of allergen names
dietary_tags TEXT[] -- vegan/vegetarian/gluten_free/keto/paleo
created_by UUID REFERENCES profiles(id)
is_public BOOLEAN DEFAULT TRUE
usage_count INTEGER DEFAULT 0
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### user_meals
Действителни хранения на потребителите
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
template_id UUID REFERENCES meal_templates(id)
name TEXT NOT NULL
meal_type TEXT (breakfast/lunch/dinner/snack/pre_workout/post_workout)
meal_date DATE DEFAULT CURRENT_DATE
consumed_at TIMESTAMP DEFAULT NOW()
total_calories DECIMAL(7,2) DEFAULT 0
total_protein_g DECIMAL(6,2) DEFAULT 0
total_carbs_g DECIMAL(6,2) DEFAULT 0
total_fat_g DECIMAL(6,2) DEFAULT 0
total_fiber_g DECIMAL(6,2) DEFAULT 0
total_sodium_mg DECIMAL(8,2) DEFAULT 0
location TEXT (home/restaurant/work)
social_context TEXT (alone/family/friends)
notes TEXT
satisfaction_rating INTEGER (1-5)
hunger_before INTEGER (1-10)
hunger_after INTEGER (1-10)
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Връзки между таблиците

### Основни Foreign Key връзки:
- profiles.id ← user_* tables.user_id (1:many)
- exercises.id ← workout_exercises.exercise_id (1:many)
- user_workouts.id ← workout_exercises.workout_id (1:many)
- food_items.id ← meal_foods.food_item_id (1:many)
- user_meals.id ← meal_foods.meal_id (1:many)

### Junction Tables (Many-to-Many):
- workout_template_exercises (workout_templates ↔ exercises)
- meal_template_foods (meal_templates ↔ food_items)
- meal_foods (user_meals ↔ food_items)

## Индекси за производителност

### User-based indexes
```sql
idx_user_workouts_user_date ON user_workouts(user_id, workout_date DESC)
idx_user_measurements_user_date ON user_measurements(user_id, measurement_date DESC)
idx_user_meals_user_date ON user_meals(user_id, meal_date DESC)
idx_daily_stats_user_date ON daily_stats(user_id, date DESC)
```

### Search indexes
```sql
idx_exercises_name ON exercises(name)
idx_food_items_name ON food_items(name)
idx_food_items_barcode ON food_items(barcode)
```

### Array indexes (GIN)
```sql
idx_exercises_muscle_groups ON exercises USING GIN(primary_muscle_groups)
idx_exercises_ai_tags ON exercises USING GIN(ai_tags)
idx_food_items_dietary_tags ON food_items USING GIN(dietary_tags)
```

## Сигурност и достъп

### Row Level Security (RLS)
Всички таблици са защитени с RLS политики:

- **Собствени данни**: Потребителите виждат само своите данни
- **Публични ресурси**: Публични упражнения, храни и шаблони достъпни за всички
- **Модификации**: Потребителите могат да модифицират само собствените си данни

### Storage Buckets
```sql
exercise-media bucket (52MB limit) - видеа и снимки за упражнения
workout-covers bucket (10MB limit) - корици за тренировки
```

## AI и медийни функции

### AI функционалности:
- **form_cues**: AI-генерирани съвети за форма
- **common_mistakes**: Често срещани грешки
- **ai_difficulty_score**: AI оценка на трудността
- **ai_suggestions**: AI предложения за тренировки

### Медийна поддръжка:
- **Множество URL-и**: video_urls[], image_urls[]
- **Storage интеграция**: Автоматично управление на файлове
- **Оптимизация**: Поддръжка за различни формати

## Примерни заявки

### Топ 10 най-използвани упражнения
```sql
SELECT e.name, COUNT(we.id) as usage_count
FROM exercises e
JOIN workout_exercises we ON e.id = we.exercise_id
GROUP BY e.id, e.name
ORDER BY usage_count DESC
LIMIT 10;
```

### Месечен прогрес за тегло
```sql
SELECT 
  DATE_TRUNC('month', measurement_date) as month,
  AVG(weight_kg) as avg_weight
FROM user_measurements 
WHERE user_id = $1 
AND measurement_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY month
ORDER BY month;
```

### Калории по дни
```sql
SELECT 
  meal_date,
  SUM(total_calories) as daily_calories
FROM user_meals 
WHERE user_id = $1 
AND meal_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY meal_date
ORDER BY meal_date;
```

## Обобщение

Базата данни GymPlanner е пълноценна система за фитнес управление с:

- **30+ таблици** за пълно покритие на фитнес нуждите
- **Row Level Security** за сигурност на данните
- **AI интеграция** за интелигентни предложения
- **Медийна поддръжка** за видеа и снимки
- **Готови данни** - 20+ упражнения и примерни данни
- **Геймификация** - постижения и прогрес
- **Всеобхватно проследяване** - тренировки, хранене, измервания

### Ключови характеристики:
- 🔐 **Сигурност**: RLS политики за всички таблици
- 🤖 **AI функции**: Генерирани съвети и анализи
- 📱 **Storage**: Безопасно съхранение на медийни файлове
- 📊 **Анализи**: Детайлни статистики и прогрес
- 🎯 **Персонализация**: Индивидуални цели и предпочитания

---

*Последна актуализация: Юли 2025 г.* 