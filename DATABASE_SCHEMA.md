# GymPlanner Database Schema Documentation

## Overview
База данни за фитнес планер, построена върху PostgreSQL с Supabase. Включва пълна система за управление на потребители, тренировки, упражнения, прогрес и хранене.

## Core Modules

### 1. Authentication & Profiles
- `profiles` - основни потребителски профили
- `user_goals` - фитнес цели
- `user_preferences` - настройки на приложението

### 2. Workout & Exercise System  
- `exercises` - база данни с упражнения
- `muscle_groups` - мускулни групи
- `equipment` - необходимо оборудване
- `workout_templates` - шаблони за тренировки
- `user_workouts` - действителни тренировки
- `workout_exercises` & `exercise_sets` - детайли за упражнения и сетове

### 3. Progress Tracking
- `user_measurements` - телесни измервания
- `progress_photos` - снимки за прогрес
- `daily_stats` - ежедневна статистика
- `exercise_personal_records` - лични рекорди
- `achievement_definitions` & `user_achievements` - постижения

### 4. Nutrition System
- `food_items` - база данни с храни
- `meal_templates` - шаблони за хранене
- `user_meals` - действителни хранения
- `nutrition_goals` - хранителни цели
- `water_intake` - проследяване на хидратация

## Key Tables Structure

### profiles (Потребителски профили)
```sql
id UUID PRIMARY KEY
first_name, last_name, full_name TEXT
date_of_birth DATE
gender TEXT
height_cm INTEGER
weight_kg DECIMAL(5,2)
fitness_goals TEXT
experience_level TEXT
```

### exercises (Упражнения)
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
description, instructions TEXT
difficulty_level TEXT
primary_muscle_groups TEXT[]
equipment_needed TEXT[]
form_cues TEXT[] -- AI генерирани съвети
ai_difficulty_score DECIMAL(3,2)
is_public BOOLEAN
```

### user_workouts (Тренировки)
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
name TEXT
workout_date DATE
total_duration_minutes INTEGER
total_volume_kg DECIMAL(10,2)
status TEXT -- planned/in_progress/completed
workout_tags TEXT[]
```

### food_items (Храни)
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
calories DECIMAL(7,2)
protein_g, carbs_g, fat_g DECIMAL(6,2)
allergens TEXT[]
dietary_tags TEXT[] -- vegan, gluten_free и др.
```

## Security
- Row Level Security (RLS) за всички таблици
- Потребителите виждат само собствените си данни
- Публични ресурси достъпни за всички

## Storage
- exercise-media bucket за видеа/снимки
- workout-covers bucket за корици на тренировки

## Sample Data
Включени са примерни упражнения и AI-генерирани данни за тестване. 