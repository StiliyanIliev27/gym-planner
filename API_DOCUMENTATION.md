# 🌐 GymPlanner - API Документация

## 📑 Съдържание

1. [Преглед](#преглед)
2. [Автентикация](#автентикация)
3. [User Service API](#user-service-api)
4. [Workout Service API](#workout-service-api)
5. [Exercise Service API](#exercise-service-api)
6. [Progress Service API](#progress-service-api)
7. [Nutrition Service API](#nutrition-service-api)
8. [Error Handling](#error-handling)
9. [Real-time Subscriptions](#real-time-subscriptions)

---

## 🎯 Преглед

GymPlanner API е построен върху Supabase и предоставя RESTful endpoints за управление на фитнес данни. Всички заявки минават през Row Level Security (RLS) за сигурност.

### Base URL
```
Production: https://your-project.supabase.co
Local: http://localhost:54321
```

### Headers
```javascript
{
  "apikey": "your-anon-key",
  "Authorization": "Bearer your-jwt-token",
  "Content-Type": "application/json"
}
```

---

## 🔐 Автентикация

### Sign Up
```javascript
// POST /auth/v1/signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      date_of_birth: '1990-01-15'
    }
  }
})

// Response
{
  user: {
    id: "uuid",
    email: "user@example.com",
    created_at: "2025-01-15T10:00:00Z"
  },
  session: null // До потвърждение на email
}
```

### Sign In
```javascript
// POST /auth/v1/token?grant_type=password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Response
{
  user: { id, email, ... },
  session: {
    access_token: "jwt-token",
    refresh_token: "refresh-token",
    expires_in: 3600
  }
}
```

### Verify Email
```javascript
// POST /auth/v1/verify
const { error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'signup'
})
```

### Refresh Token
```javascript
// POST /auth/v1/token?grant_type=refresh_token
const { data, error } = await supabase.auth.refreshSession()
```

### Sign Out
```javascript
// POST /auth/v1/logout
const { error } = await supabase.auth.signOut()
```

---

## 👤 User Service API

### Get User Profile
```javascript
// GET /rest/v1/profiles?id=eq.{userId}
const { data: profile, error } = await getUserProfile(userId)

// Response
{
  id: "uuid",
  full_name: "John Doe",
  avatar_url: "https://...",
  date_of_birth: "1990-01-15",
  height_cm: 180,
  weight_kg: 75.5,
  fitness_goals: "muscle_gain",
  experience_level: "intermediate",
  user_goals: [{
    goal_type: "muscle_gain",
    target_weight_kg: 80,
    target_date: "2025-06-01"
  }],
  user_preferences: {
    theme: "dark",
    units_system: "metric"
  }
}
```

### Update User Profile
```javascript
// PATCH /rest/v1/profiles?id=eq.{userId}
const { data, error } = await updateUserProfile(userId, {
  height_cm: 182,
  weight_kg: 76,
  fitness_goals: "strength"
})

// Request Body
{
  height_cm: 182,
  weight_kg: 76,
  fitness_goals: "strength"
}
```

### Get User Goals
```javascript
// GET /rest/v1/user_goals?user_id=eq.{userId}
const { data: goals, error } = await getUserGoals(userId)

// Response
[
  {
    id: "uuid",
    user_id: "uuid",
    goal_type: "muscle_gain",
    target_weight_kg: 80,
    target_body_fat_percentage: 12,
    target_date: "2025-06-01",
    weekly_workout_frequency: 4,
    daily_calorie_goal: 3000,
    is_active: true
  }
]
```

### Create/Update Goal
```javascript
// POST /rest/v1/user_goals (upsert)
const { data, error } = await upsertUserGoal(userId, {
  goal_type: "muscle_gain",
  target_weight_kg: 80,
  weekly_workout_frequency: 4
})
```

### Get Daily Stats
```javascript
// GET /rest/v1/daily_stats?user_id=eq.{userId}&date=gte.{start}&date=lte.{end}
const { data: stats, error } = await getUserDailyStats(
  userId,
  '2025-01-01',
  '2025-01-31'
)

// Response
[
  {
    id: "uuid",
    date: "2025-01-15",
    steps_count: 8500,
    calories_burned: 450,
    calories_consumed: 2500,
    protein_grams: 150,
    water_liters: 2.5,
    workouts_completed: 1,
    sleep_hours: 7.5
  }
]
```

---

## 💪 Workout Service API

### Get User Workouts
```javascript
// GET /rest/v1/user_workouts?user_id=eq.{userId}&workout_date=gte.{start}&workout_date=lte.{end}
const { data: workouts, error } = await getUserWorkouts(
  userId,
  '2025-01-01',
  '2025-01-31'
)

// Response with nested data
[
  {
    id: "uuid",
    name: "Upper Body Strength",
    workout_date: "2025-01-15",
    status: "completed",
    total_duration_minutes: 65,
    total_volume_kg: 3250,
    workout_exercises: [
      {
        id: "uuid",
        order_index: 1,
        exercises: {
          name: "Bench Press",
          primary_muscle_groups: ["chest", "triceps"],
          form_cues: ["Keep core tight", "Control the descent"]
        },
        exercise_sets: [
          {
            set_number: 1,
            reps: 12,
            weight_kg: 60,
            is_completed: true
          }
        ]
      }
    ]
  }
]
```

### Get Workout by ID
```javascript
// GET /rest/v1/user_workouts?id=eq.{workoutId}
const { data: workout, error } = await getWorkoutById(workoutId)
```

### Create Workout
```javascript
// POST /rest/v1/user_workouts
const { data: workout, error } = await createWorkout(userId, {
  name: "Leg Day",
  workout_date: "2025-01-16",
  status: "planned",
  workout_tags: ["strength", "lower_body"]
})

// Response
{
  id: "uuid",
  user_id: "uuid",
  name: "Leg Day",
  workout_date: "2025-01-16",
  status: "planned",
  created_at: "2025-01-15T10:00:00Z"
}
```

### Update Workout
```javascript
// PATCH /rest/v1/user_workouts?id=eq.{workoutId}
const { data, error } = await updateWorkout(workoutId, {
  status: "in_progress",
  started_at: new Date().toISOString()
})
```

### Add Exercise to Workout
```javascript
// POST /rest/v1/workout_exercises
const { data, error } = await addExerciseToWorkout(
  workoutId,
  exerciseId,
  {
    order_index: 1,
    default_sets: 3,
    default_reps_min: 8,
    default_reps_max: 12
  }
)
```

### Log Exercise Set
```javascript
// POST /rest/v1/exercise_sets
const { data, error } = await addSetToExercise(workoutExerciseId, {
  set_number: 1,
  set_type: "working",
  reps: 10,
  weight_kg: 70,
  rpe: 8,
  is_completed: true
})
```

### Get Workout Statistics
```javascript
// Custom function call
const { data: stats, error } = await getWorkoutStats(userId, 30)

// Response
{
  totalWorkouts: 12,
  totalDuration: 780, // minutes
  averageDuration: 65,
  workoutsByTags: {
    "strength": 8,
    "cardio": 4
  },
  muscleGroupsWorked: {
    "chest": 6,
    "back": 5,
    "legs": 4
  },
  workoutsThisWeek: 3,
  workoutsThisMonth: 12
}
```

---

## 🏋️ Exercise Service API

### Get All Exercises
```javascript
// GET /rest/v1/exercises?is_public=eq.true
const { data: exercises, error } = await getExercises({
  muscleGroup: 'chest',
  equipment: 'barbell',
  difficulty: 'intermediate'
})

// With filters
// GET /rest/v1/exercises?primary_muscle_groups=cs.{chest}&equipment_needed=cs.{barbell}
```

### Get Exercise by ID
```javascript
// GET /rest/v1/exercises?id=eq.{exerciseId}
const { data: exercise, error } = await getExerciseById(exerciseId)

// Response
{
  id: "uuid",
  name: "Bench Press",
  description: "Classic chest exercise",
  instructions: "Lie on bench...",
  primary_muscle_groups: ["chest"],
  secondary_muscle_groups: ["triceps", "shoulders"],
  equipment_needed: ["barbell", "bench"],
  form_cues: [
    "Keep feet flat on floor",
    "Maintain natural arch",
    "Control the weight"
  ],
  common_mistakes: [
    "Bouncing bar off chest",
    "Flaring elbows too wide"
  ],
  demo_video_url: "https://...",
  ai_difficulty_score: 0.65
}
```

### Search Exercises
```javascript
// GET /rest/v1/exercises?name=ilike.%{searchTerm}%
const { data: results, error } = await searchExercises('bench')
```

### Get Exercises by Muscle Group
```javascript
// GET /rest/v1/exercises?primary_muscle_groups=cs.{muscleGroup}
const { data: exercises, error } = await getExercisesByMuscleGroup('chest')
```

### Create Custom Exercise
```javascript
// POST /rest/v1/exercises
const { data: exercise, error } = await createCustomExercise(userId, {
  name: "Custom Bench Variation",
  description: "My personal variation",
  primary_muscle_groups: ["chest"],
  equipment_needed: ["barbell"],
  is_public: false,
  created_by: userId
})
```

---

## 📊 Progress Service API

### Get User Measurements
```javascript
// GET /rest/v1/user_measurements?user_id=eq.{userId}&measurement_date=gte.{start}
const { data: measurements, error } = await getUserMeasurements(
  userId,
  { startDate: '2025-01-01', endDate: '2025-01-31' }
)

// Response
[
  {
    id: "uuid",
    measurement_date: "2025-01-15",
    weight_kg: 75.5,
    body_fat_percentage: 15.2,
    muscle_mass_kg: 63.8,
    waist_cm: 82,
    chest_cm: 102,
    bicep_left_cm: 35
  }
]
```

### Create Measurement
```javascript
// POST /rest/v1/user_measurements
const { data, error } = await createMeasurement(userId, {
  weight_kg: 75.5,
  body_fat_percentage: 15.2,
  waist_cm: 82
})
```

### Get Personal Records
```javascript
// GET /rest/v1/exercise_personal_records?user_id=eq.{userId}
const { data: records, error } = await getPersonalRecords(userId)

// Response
[
  {
    id: "uuid",
    exercise_id: "uuid",
    record_type: "1rm",
    weight_kg: 100,
    achieved_date: "2025-01-10",
    exercises: {
      name: "Bench Press"
    }
  }
]
```

### Check Achievements
```javascript
// GET /rest/v1/user_achievements?user_id=eq.{userId}
const { data: achievements, error } = await getUserAchievements(userId)

// Response
[
  {
    id: "uuid",
    achievement_id: "uuid",
    progress_value: 10,
    is_completed: true,
    completed_at: "2025-01-15T10:00:00Z",
    achievement_definitions: {
      name: "Iron Warrior",
      description: "Complete 10 strength workouts",
      category: "workout",
      points: 100
    }
  }
]
```

### Upload Progress Photo
```javascript
// POST /storage/v1/object/progress-photos/{userId}/{filename}
const { data: upload, error } = await uploadProgressPhoto(file)

// Then save reference
// POST /rest/v1/progress_photos
const { data: photo, error } = await createProgressPhoto(userId, {
  photo_url: upload.publicUrl,
  photo_type: 'front',
  photo_date: '2025-01-15'
})
```

---

## 🍎 Nutrition Service API

### Get Food Items
```javascript
// GET /rest/v1/food_items?is_public=eq.true
const { data: foods, error } = await getFoodItems({
  category: 'protein',
  search: 'chicken'
})
```

### Search Foods
```javascript
// GET /rest/v1/food_items?name=ilike.%{searchTerm}%
const { data: results, error } = await searchFoods('chicken breast')

// Response
[
  {
    id: "uuid",
    name: "Chicken Breast, Grilled",
    serving_size_g: 100,
    calories: 165,
    protein_g: 31,
    carbs_g: 0,
    fat_g: 3.6,
    dietary_tags: ["high-protein", "low-carb"]
  }
]
```

### Create Custom Food
```javascript
// POST /rest/v1/food_items
const { data: food, error } = await createCustomFood(userId, {
  name: "My Protein Shake",
  serving_size_g: 350,
  calories: 280,
  protein_g: 40,
  carbs_g: 15,
  fat_g: 5,
  is_public: false
})
```

### Log Meal
```javascript
// POST /rest/v1/user_meals
const { data: meal, error } = await createMeal(userId, {
  name: "Post-Workout Meal",
  meal_type: "post_workout",
  meal_date: "2025-01-15",
  consumed_at: new Date().toISOString()
})

// Then add foods
// POST /rest/v1/meal_foods
const { data, error } = await addFoodToMeal(meal.id, {
  food_item_id: foodId,
  quantity: 150,
  unit: 'g'
})
```

### Get Nutrition Goals
```javascript
// GET /rest/v1/nutrition_goals?user_id=eq.{userId}&is_active=eq.true
const { data: goals, error } = await getNutritionGoals(userId)

// Response
{
  id: "uuid",
  calories_target: 2500,
  protein_target_g: 150,
  carbs_target_g: 300,
  fat_target_g: 80,
  water_target_liters: 3
}
```

### Log Water Intake
```javascript
// POST /rest/v1/water_intake
const { data, error } = await logWaterIntake(userId, {
  amount_ml: 500,
  source_type: 'water'
})
```

---

## ❌ Error Handling

### Error Response Format
```javascript
{
  error: {
    message: "Error description",
    details: "Detailed error information",
    hint: "Suggestion for fixing",
    code: "PGRST116" // PostgreSQL/PostgREST error code
  }
}
```

### Common Error Codes
- `PGRST116` - Resource not found
- `PGRST204` - No rows returned 
- `PGRST301` - Uniqueness violation
- `42501` - Insufficient privileges (RLS)
- `23505` - Unique constraint violation
- `23503` - Foreign key violation

### Error Handling Example
```javascript
try {
  const { data, error } = await getUserProfile(userId)
  
  if (error) {
    switch (error.code) {
      case 'PGRST116':
        console.error('Profile not found')
        break
      case '42501':
        console.error('Access denied')
        break
      default:
        console.error('Unexpected error:', error)
    }
    return null
  }
  
  return data
} catch (err) {
  console.error('Network error:', err)
  throw err
}
```

---

## 🔄 Real-time Subscriptions

### Subscribe to Workout Updates
```javascript
const subscription = supabase
  .channel('workout-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_workouts',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Workout changed:', payload)
      // payload.eventType: 'INSERT' | 'UPDATE' | 'DELETE'
      // payload.new: new row data
      // payload.old: old row data
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### Subscribe to Progress Updates
```javascript
const subscription = supabase
  .channel('progress-updates')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'user_measurements',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      toast.success('New measurement recorded!')
      refreshMeasurements()
    }
  )
  .subscribe()
```

### Presence (Online Users)
```javascript
const channel = supabase.channel('online-users')

// Track online presence
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState()
    console.log('Online users:', state)
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', newPresences)
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', leftPresences)
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track({
        user_id: userId,
        online_at: new Date().toISOString()
      })
    }
  })
```

---

## 🛡️ Security Best Practices

### 1. Always Use RLS
```sql
-- Example RLS policy
CREATE POLICY "Users can only see own workouts" 
ON user_workouts 
FOR SELECT 
USING (auth.uid() = user_id);
```

### 2. Validate Input
```javascript
// Client-side validation
const isValidWeight = (weight) => {
  return weight > 0 && weight < 1000
}

// Server-side constraints
ALTER TABLE exercise_sets 
ADD CONSTRAINT valid_weight 
CHECK (weight_kg > 0 AND weight_kg < 1000);
```

### 3. Rate Limiting
```javascript
// Implement client-side rate limiting
const rateLimiter = {
  attempts: 0,
  resetTime: Date.now() + 60000, // 1 minute
  
  canMakeRequest() {
    if (Date.now() > this.resetTime) {
      this.attempts = 0
      this.resetTime = Date.now() + 60000
    }
    
    if (this.attempts >= 60) { // 60 requests per minute
      return false
    }
    
    this.attempts++
    return true
  }
}
```

### 4. Sanitize User Input
```javascript
// Sanitize before saving
const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .substring(0, 255) // Limit length
}
```

---

## 📈 Performance Tips

### 1. Use Select Queries
```javascript
// ✅ Good - only select needed fields
const { data } = await supabase
  .from('user_workouts')
  .select('id, name, workout_date, status')
  .eq('user_id', userId)

// ❌ Bad - selecting everything
const { data } = await supabase
  .from('user_workouts')
  .select('*')
```

### 2. Pagination
```javascript
const PAGE_SIZE = 20

const { data, error } = await supabase
  .from('user_workouts')
  .select('*', { count: 'exact' })
  .eq('user_id', userId)
  .order('workout_date', { ascending: false })
  .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
```

### 3. Batch Operations
```javascript
// ✅ Good - batch insert
const { data, error } = await supabase
  .from('exercise_sets')
  .insert([
    { workout_exercise_id: id1, reps: 10, weight_kg: 50 },
    { workout_exercise_id: id2, reps: 12, weight_kg: 45 },
    { workout_exercise_id: id3, reps: 8, weight_kg: 55 }
  ])

// ❌ Bad - multiple individual inserts
for (const set of sets) {
  await supabase.from('exercise_sets').insert(set)
}
```

---

*Последна актуализация: Януари 2025*
*Версия: 1.0.0*