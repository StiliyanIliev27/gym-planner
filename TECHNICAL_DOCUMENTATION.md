# 🏋️ GymPlanner - Technical Documentation

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technologies](#architecture--technologies)
3. [Installation & Setup](#installation--setup)
4. [Project Structure](#project-structure)
5. [Database](#database)
6. [API Services](#api-services)
7. [State Management](#state-management)
8. [UI Components](#ui-components)
9. [Authentication & Security](#authentication--security)
10. [Features](#features)
11. [Usage Examples](#usage-examples)
12. [Best Practices](#best-practices)

---

## 🎯 Project Overview

GymPlanner is a modern web application for fitness management, providing:

- **Personalized workout plans** with AI assistant
- **Progress tracking** with detailed metrics
- **Nutrition planner** for balanced meals
- **Social features** for sharing achievements
- **Mobile-optimized interface** with dark/light theme

### Key Features

- 🚀 **High performance** with Next.js 15 and Turbopack
- 🔐 **Secure authentication** with Supabase Auth
- 🎨 **Modern design** with Tailwind CSS and shadcn/ui
- 🤖 **AI-powered features** for personalized recommendations
- 📱 **Responsive design** for all devices

---

## 🏗️ Architecture & Technologies

### Frontend Stack

```javascript
{
  "framework": "Next.js 15.3.3",
  "ui": {
    "components": "shadcn/ui",
    "styling": "Tailwind CSS 4",
    "icons": "Lucide React + React Icons",
    "animations": "Lottie React"
  },
  "state": "Zustand 5.0.5",
  "themes": "next-themes 0.4.6",
  "notifications": "Sonner 2.0.5"
}
```

### Backend Stack

```javascript
{
  "database": "PostgreSQL (via Supabase)",
  "auth": "Supabase Auth",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime",
  "functions": "Edge Functions (Deno)"
}
```

### Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Next.js App   │────▶│   Supabase      │────▶│   PostgreSQL    │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Stores   │     │  Auth Service   │     │  RLS Policies   │
│   (Zustand)     │     │  Storage API    │     │  Migrations     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 📦 Инсталация и Настройка

### Предварителни Изисквания

- Node.js 18+ 
- npm/yarn/pnpm
- Supabase акаунт
- Git

### Стъпки за Инсталация

```bash
# 1. Клониране на репозиторито
git clone [repository-url]
cd gym-planner

# 2. Инсталиране на зависимости
npm install

# 3. Настройка на environment variables
cp .env.example .env.local
```

### Environment Variables

Създайте `.env.local` файл със следните променливи:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
```

### База Данни Setup

```bash
# Инсталиране на Supabase CLI
npm install -g supabase

# Инициализация на локална Supabase инстанция
supabase init

# Стартиране на локална инстанция
supabase start

# Прилагане на миграции
supabase db push
```

### Стартиране на Development Server

```bash
# Development режим с Turbopack
npm run dev

# Production build
npm run build
npm start
```

---

## 📁 Структура на Проекта

```
gym-planner/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (authenticated)/      # Защитени страници
│   │   │   ├── dashboard/        # Главно табло
│   │   │   ├── workout-builder/  # AI workout builder
│   │   │   ├── my-workouts/      # Потребителски тренировки
│   │   │   ├── exercises/        # База с упражнения
│   │   │   └── profile/          # Потребителски профил
│   │   │
│   │   ├── (public)/            # Публични страници
│   │   │   └── auth/            # Login/Register
│   │   │
│   │   ├── layout.js           # Root layout
│   │   └── globals.css         # Глобални стилове
│   │
│   ├── components/              # React компоненти
│   │   ├── ui/                 # Базови UI компоненти
│   │   ├── common/             # Споделени компоненти
│   │   └── features/           # Feature-specific
│   │
│   ├── lib/                    # Библиотеки и утилити
│   │   ├── supabase/          # Supabase клиенти
│   │   ├── services/          # API сървиси
│   │   ├── utils/             # Помощни функции
│   │   └── config/            # Конфигурации
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Zustand stores
│   ├── providers/              # Context providers
│   └── types/                  # Type дефиниции
│
├── supabase/                   # Supabase конфигурация
│   ├── migrations/            # SQL миграции
│   └── functions/             # Edge функции
│
└── public/                     # Статични файлове
```

---

## 🗄️ База Данни

### Схема Преглед

Базата данни е организирана в 4 основни модула:

#### 1. **Потребители и Профили**
```sql
-- profiles таблица
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  fitness_goals TEXT,
  experience_level TEXT,
  -- и други полета...
);
```

#### 2. **Тренировки и Упражнения**
```sql
-- exercises таблица (20+ предварително заредени упражнения)
CREATE TABLE exercises (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  primary_muscle_groups TEXT[],
  form_cues TEXT[],         -- AI генерирани съвети
  common_mistakes TEXT[],   -- Чести грешки
  ai_difficulty_score DECIMAL(3,2),
  -- медия и AI features...
);

-- user_workouts таблица
CREATE TABLE user_workouts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT,
  workout_date DATE,
  total_volume_kg DECIMAL(10,2),
  ai_suggestions TEXT[],
  -- и други полета...
);
```

#### 3. **Проследяване на Прогреса**
```sql
-- user_measurements таблица
CREATE TABLE user_measurements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  -- детайлни измервания...
);

-- achievement система
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  achievement_id UUID,
  progress_value DECIMAL(10,2),
  -- постижения и badges...
);
```

#### 4. **Хранене**
```sql
-- food_items база данни
CREATE TABLE food_items (
  id UUID PRIMARY KEY,
  name TEXT,
  calories DECIMAL(7,2),
  protein_g DECIMAL(6,2),
  carbs_g DECIMAL(6,2),
  fat_g DECIMAL(6,2),
  -- хранителни стойности...
);

-- user_meals проследяване
CREATE TABLE user_meals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  meal_type TEXT,
  total_calories DECIMAL(7,2),
  -- и други полета...
);
```

### Row Level Security (RLS)

Всички таблици са защитени с RLS политики:

```sql
-- Пример RLS политика
CREATE POLICY "Users can only see their own data" 
  ON user_workouts 
  FOR ALL 
  USING (auth.uid() = user_id);
```

---

## 🔧 API Сървиси

### User Service (`userService.js`)

```javascript
// Основни функции
getUserProfile(userId)         // Получаване на потребителски профил
updateUserProfile(userId, data) // Обновяване на профил
getUserGoals(userId)           // Получаване на цели
upsertUserGoal(userId, data)   // Създаване/обновяване на цел
getUserPreferences(userId)     // Получаване на настройки
updateUserPreferences(userId, data) // Обновяване на настройки
getUserDailyStats(userId, start, end) // Дневна статистика
upsertDailyStats(userId, date, data) // Обновяване на статистика
```

#### Пример за Употреба:

```javascript
import { getUserProfile, updateUserProfile } from '@/lib/services';

// Получаване на профил
const { data: profile, error } = await getUserProfile(userId);

// Обновяване на профил
const { data, error } = await updateUserProfile(userId, {
  height_cm: 180,
  weight_kg: 75.5,
  fitness_goals: 'muscle_gain'
});
```

### Workout Service (`workoutService.js`)

```javascript
// Основни функции
getUserWorkouts(userId, startDate, endDate) // Получаване на тренировки
getWorkoutById(workoutId)           // Получаване на конкретна тренировка
createWorkout(userId, data)         // Създаване на тренировка
updateWorkout(workoutId, data)      // Обновяване на тренировка
deleteWorkout(workoutId)            // Изтриване на тренировка
addExerciseToWorkout(workoutId, exerciseId, data) // Добавяне на упражнение
addSetToExercise(workoutExerciseId, setData) // Добавяне на сет
getWorkoutStats(userId, days)       // Статистика за тренировки
```

#### Пример за Употреба:

```javascript
// Създаване на нова тренировка
const { data: workout } = await createWorkout(userId, {
  name: "Upper Body Strength",
  workout_date: "2025-01-15",
  workout_tags: ["strength", "upper_body"]
});

// Добавяне на упражнение
const { data: exercise } = await addExerciseToWorkout(workout.id, exerciseId, {
  order_index: 1,
  default_sets: 3,
  default_reps_min: 8,
  default_reps_max: 12
});
```

### Exercise Service (`exerciseService.js`)

```javascript
// Основни функции
getExercises(filters)          // Получаване на упражнения с филтри
getExerciseById(id)           // Получаване на конкретно упражнение
searchExercises(searchTerm)   // Търсене на упражнения
getExercisesByMuscleGroup(group) // Упражнения по мускулна група
getPublicExercises()          // Публични упражнения
createCustomExercise(userId, data) // Създаване на custom упражнение
```

---

## 🗂️ State Management

### Auth Store (`useAuthStore.js`)

```javascript
// State структура
{
  // Auth state
  user: null,              // Supabase user обект
  isLoading: true,         // Loading състояние
  
  // User data
  profile: null,           // Потребителски профил
  goals: [],              // Фитнес цели
  preferences: null,       // Настройки
  dailyStats: null,       // Дневна статистика
  
  // Actions
  setUser: (user) => {},
  clearUser: () => {},
  loadUserProfile: async (userId) => {},
  updateProfile: async (profileData) => {},
  updateGoal: async (goalData) => {},
  updatePreferences: async (prefs) => {},
  
  // Getters
  getFullName: () => string,
  getInitials: () => string,
  hasCompletedProfile: () => boolean,
  getCurrentGoal: (type) => goal
}
```

#### Пример за Употреба:

```javascript
import { useAuthStore } from '@/stores/auth/useAuthStore';

function ProfileComponent() {
  const { profile, updateProfile, getFullName } = useAuthStore();
  
  const handleUpdateHeight = async (newHeight) => {
    const result = await updateProfile({ height_cm: newHeight });
    if (result.success) {
      toast.success("Височината е обновена!");
    }
  };
  
  return <h1>Здравей, {getFullName()}!</h1>;
}
```

### Workout Store (`useWorkoutStore.js`)

```javascript
// State структура
{
  // Workouts data
  workouts: [],
  currentWorkout: null,
  templates: [],
  
  // AI Builder state
  aiAssessment: {
    experienceLevel: '',
    goals: [],
    availability: {},
    equipment: [],
    preferences: {}
  },
  generatedWorkout: null,
  
  // Actions
  loadWorkouts: async (userId, dateRange) => {},
  createWorkout: async (workoutData) => {},
  updateWorkout: async (id, data) => {},
  generateAIWorkout: async () => {},
  saveAIWorkout: async (workout) => {}
}
```

---

## 🎨 UI Компоненти

### Базови Компоненти (shadcn/ui)

#### Button Компонент

```jsx
import { Button } from '@/components/ui/button';

// Варианти
<Button variant="default">Primary Button</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>

// Размери
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

#### Card Компонент

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Заглавие</CardTitle>
    <CardDescription>Описание</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Съдържание */}
  </CardContent>
  <CardFooter>
    <Button>Действие</Button>
  </CardFooter>
</Card>
```

#### Dialog Компонент

```jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Отвори диалог</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Заглавие на диалога</DialogTitle>
    </DialogHeader>
    {/* Съдържание на диалога */}
  </DialogContent>
</Dialog>
```

### Custom Компоненти

#### PageLoader

```jsx
import { PageLoader } from '@/components/common/PageLoader';

// Използване
<PageLoader />  // Показва centered spinner
```

#### LoadingSkeleton

```jsx
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';

// Варианти
<LoadingSkeleton variant="card" />
<LoadingSkeleton variant="list" count={3} />
<LoadingSkeleton variant="text" lines={5} />
```

---

## 🔐 Автентикация и Сигурност

### Автентикация Flow

```javascript
// 1. Регистрация
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
});

// 2. Email верификация
// Автоматично се изпраща имейл с код за потвърждение

// 3. Вход
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// 4. Session управление
// Автоматично се управлява от AuthProvider
```

### Route Protection

```jsx
// useAuthGuard hook
import { useAuthGuard } from '@/hooks/auth/useAuthGuard';

function ProtectedPage() {
  const { isLoading } = useAuthGuard();
  
  if (isLoading) return <PageLoader />;
  
  return <div>Protected content</div>;
}
```

### Session Timeout

```jsx
// useSessionTimeout hook
import { useSessionTimeout } from '@/hooks/auth/useSessionTimeout';

function App() {
  useSessionTimeout({
    warningTime: 5 * 60 * 1000,    // 5 минути преди изтичане
    sessionDuration: 30 * 60 * 1000 // 30 минути session
  });
}
```

---

## 🚀 Функционалности

### 1. Dashboard

Dashboard-ът предоставя преглед на:

- **Днешна статистика** - калории, вода, активност
- **Седмични цели** - прогрес към целите
- **BMI калкулатор** - автоматично изчисление
- **Progress charts** - визуализация на прогреса
- **Quick Actions** - бързи действия (8 опции)
- **Upcoming workouts** - предстоящи тренировки

```jsx
// Dashboard компоненти
<BasicUserStats />      // Основна статистика
<QuickActions />       // Бързи действия
<ProgressCharts />     // Графики
<ActivityFeed />       // Последна активност
<SmartInsights />      // AI insights
```

### 2. AI Workout Builder

5-стъпков процес за създаване на персонализирана тренировка:

1. **Fitness Level** - Избор на ниво (beginner/intermediate/advanced)
2. **Goals** - Избор на цели (до 3)
3. **Schedule** - Седмична наличност
4. **Equipment** - Налично оборудване
5. **Preferences** - Допълнителни предпочитания

```jsx
// AI Builder използване
const workout = await generateAIWorkout({
  experienceLevel: 'intermediate',
  goals: ['muscle_gain', 'strength'],
  daysPerWeek: 4,
  equipment: ['barbell', 'dumbbells', 'pull_up_bar'],
  sessionDuration: 60,
  preferences: {
    avoidExercises: [],
    focusAreas: ['chest', 'back']
  }
});
```

### 3. Workout Management

```jsx
// Създаване на тренировка
const workout = {
  name: "Upper Body Power",
  workout_date: new Date(),
  exercises: [
    {
      exercise_id: exerciseId,
      sets: [
        { reps: 12, weight_kg: 20 },
        { reps: 10, weight_kg: 22.5 },
        { reps: 8, weight_kg: 25 }
      ]
    }
  ]
};

await createWorkout(userId, workout);
```

### 4. Exercise Library

База данни с 20+ упражнения, всяко включва:

- **Видео демонстрации**
- **AI form cues** - съвети за правилна техника
- **Common mistakes** - чести грешки
- **Progressions/Regressions** - варианти
- **Difficulty score** - AI оценка на трудността

```jsx
// Търсене на упражнения
const exercises = await searchExercises({
  muscleGroup: 'chest',
  equipment: 'barbell',
  difficulty: 'intermediate'
});
```

---

## 📝 Примери за Употреба

### Пример 1: Създаване на Потребителски Профил

```javascript
// 1. След регистрация, обновяване на профила
const profileData = {
  full_name: "Иван Иванов",
  date_of_birth: "1990-01-15",
  gender: "male",
  height_cm: 180,
  weight_kg: 75,
  fitness_goals: "muscle_gain",
  experience_level: "intermediate"
};

const { data, error } = await updateUserProfile(userId, profileData);

// 2. Задаване на цели
const goalData = {
  goal_type: "muscle_gain",
  target_weight_kg: 80,
  target_date: "2025-06-01",
  weekly_workout_frequency: 4,
  daily_calorie_goal: 3000
};

await upsertUserGoal(userId, goalData);

// 3. Настройки
const preferences = {
  theme: "dark",
  units_system: "metric",
  workout_reminders: true,
  public_profile: false
};

await updateUserPreferences(userId, preferences);
```

### Пример 2: Създаване и Изпълнение на Тренировка

```javascript
// 1. Създаване на тренировка от AI Builder
const aiWorkout = await generateAIWorkout({
  experienceLevel: 'intermediate',
  goals: ['strength', 'muscle_gain'],
  equipment: ['barbell', 'dumbbells']
});

// 2. Запазване като user workout
const workout = await createWorkout(userId, {
  name: aiWorkout.name,
  workout_date: new Date().toISOString().split('T')[0],
  template_id: aiWorkout.templateId,
  status: 'planned'
});

// 3. Започване на тренировката
await updateWorkout(workout.id, {
  status: 'in_progress',
  started_at: new Date()
});

// 4. Логване на сетове
for (const exercise of workout.exercises) {
  for (const set of exercise.sets) {
    await addSetToExercise(exercise.id, {
      set_number: set.number,
      reps: set.completedReps,
      weight_kg: set.weight,
      rpe: set.rpe,
      is_completed: true
    });
  }
}

// 5. Завършване на тренировката
await updateWorkout(workout.id, {
  status: 'completed',
  completed_at: new Date(),
  total_duration_minutes: 65,
  perceived_exertion: 8,
  session_rating: 5
});
```

### Пример 3: Проследяване на Прогрес

```javascript
// 1. Добавяне на измервания
const measurement = {
  weight_kg: 75.5,
  body_fat_percentage: 15.2,
  waist_cm: 82,
  chest_cm: 102,
  bicep_left_cm: 35,
  bicep_right_cm: 35
};

await createMeasurement(userId, measurement);

// 2. Качване на progress снимка
const photoUrl = await uploadProgressPhoto(file);
await createProgressPhoto(userId, {
  photo_url: photoUrl,
  photo_type: 'front',
  photo_date: new Date()
});

// 3. Проверка за постижения
const achievements = await checkUserAchievements(userId);
if (achievements.newAchievements.length > 0) {
  toast.success(`Поздравления! Отключихте ${achievements.newAchievements.length} нови постижения!`);
}

// 4. Получаване на статистика
const stats = await getProgressStats(userId, 30); // последните 30 дни
console.log(`Загубени килограми: ${stats.weightLoss}`);
console.log(`Мускулна маса: +${stats.muscleGain}`);
```

### Пример 4: Хранителен План

```javascript
// 1. Задаване на хранителни цели
const nutritionGoals = {
  calories_target: 2500,
  protein_target_g: 150,
  carbs_target_g: 300,
  fat_target_g: 80,
  water_target_liters: 3
};

await createNutritionGoal(userId, nutritionGoals);

// 2. Логване на хранене
const breakfast = {
  name: "Protein Oatmeal",
  meal_type: "breakfast",
  foods: [
    { food_id: oatsId, quantity: 100, unit: 'g' },
    { food_id: proteinPowderId, quantity: 30, unit: 'g' },
    { food_id: bananaId, quantity: 1, unit: 'piece' }
  ]
};

const meal = await createMeal(userId, breakfast);

// 3. Проследяване на вода
await logWaterIntake(userId, {
  amount_ml: 500,
  source_type: 'water'
});

// 4. Дневна статистика
const dailyNutrition = await getDailyNutritionStats(userId);
console.log(`Калории: ${dailyNutrition.calories}/${nutritionGoals.calories_target}`);
```

---

## 🎯 Най-добри Практики

### 1. Код Организация

```javascript
// ✅ Добре организиран компонент
// src/components/features/workout/WorkoutCard.jsx
import { Card } from '@/components/ui/card';
import { formatDate, calculateDuration } from '@/lib/utils';
import { useWorkoutStore } from '@/stores/workout/useWorkoutStore';

export function WorkoutCard({ workout }) {
  const { updateWorkout } = useWorkoutStore();
  
  // Component logic...
}

// ❌ Лошо организиран компонент
// Всичко в един файл, без разделение на concerns
```

### 2. Error Handling

```javascript
// ✅ Правилно error handling
try {
  setLoading(true);
  const { data, error } = await getUserWorkouts(userId);
  
  if (error) {
    console.error('Error fetching workouts:', error);
    toast.error('Неуспешно зареждане на тренировките');
    return;
  }
  
  setWorkouts(data);
  toast.success('Тренировките са заредени успешно');
} catch (error) {
  console.error('Unexpected error:', error);
  toast.error('Възникна неочаквана грешка');
} finally {
  setLoading(false);
}

// ❌ Без error handling
const data = await getUserWorkouts(userId);
setWorkouts(data);
```

### 3. Performance Оптимизация

```javascript
// ✅ Използване на React hooks за оптимизация
import { useMemo, useCallback, memo } from 'react';

const WorkoutList = memo(({ workouts, userId }) => {
  // Мемоизиране на изчисления
  const sortedWorkouts = useMemo(() => 
    workouts.sort((a, b) => new Date(b.date) - new Date(a.date)),
    [workouts]
  );
  
  // Мемоизиране на callbacks
  const handleUpdate = useCallback((id, data) => {
    updateWorkout(id, data);
  }, [updateWorkout]);
  
  return (
    // Component JSX
  );
});
```

### 4. Database Queries

```javascript
// ✅ Ефективни заявки
// Използване на select за ограничаване на данните
const { data } = await supabase
  .from('user_workouts')
  .select('id, name, workout_date, status')
  .eq('user_id', userId)
  .gte('workout_date', startDate)
  .lte('workout_date', endDate)
  .order('workout_date', { ascending: false })
  .limit(10);

// ❌ Неефективни заявки
// Зареждане на всички данни без филтриране
const { data } = await supabase
  .from('user_workouts')
  .select('*');
```

### 5. State Management

```javascript
// ✅ Правилно използване на Zustand
const useWorkoutStore = create((set, get) => ({
  workouts: [],
  
  // Actions с правилно state update
  addWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, workout]
  })),
  
  // Селектори за производителност
  getWorkoutById: (id) => {
    return get().workouts.find(w => w.id === id);
  }
}));

// Използване със selector за по-добра производителност
const workout = useWorkoutStore(state => state.getWorkoutById(id));
```

### 6. Type Safety (Препоръчително)

```javascript
// ✅ Използване на JSDoc за type hints
/**
 * @typedef {Object} Workout
 * @property {string} id - Workout ID
 * @property {string} name - Workout name
 * @property {Date} workout_date - Date of workout
 * @property {Array<Exercise>} exercises - List of exercises
 */

/**
 * Creates a new workout
 * @param {string} userId - User ID
 * @param {Workout} workoutData - Workout data
 * @returns {Promise<{data: Workout|null, error: Error|null}>}
 */
export const createWorkout = async (userId, workoutData) => {
  // Implementation
};
```

---

## 🚀 Deployment и Production

### Vercel Deployment

```bash
# 1. Инсталиране на Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Environment variables
# Добавете в Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
```

### Production Checklist

- [ ] Environment variables конфигурирани
- [ ] Database миграции приложени
- [ ] RLS политики активни
- [ ] Edge functions deployed
- [ ] Storage buckets конфигурирани
- [ ] Custom domain настроен
- [ ] SSL сертификат активен
- [ ] Analytics интегриран
- [ ] Error tracking (Sentry) настроен
- [ ] Performance monitoring активен

---

## 📚 Допълнителни Ресурси

### Документация

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://github.com/pmndrs/zustand)

### Полезни Команди

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run lint            # Run linter

# Database
supabase db reset       # Reset database
supabase db push        # Apply migrations
supabase db diff        # Generate migration

# Testing
npm run test            # Run tests
npm run test:e2e        # Run E2E tests
```

---

*Последна актуализация: Януари 2025*
*Версия: 1.0.0*
