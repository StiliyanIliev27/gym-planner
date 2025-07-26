# 📘 GymPlanner - Примери за Използване

## 📑 Съдържание

1. [Автентикация](#автентикация)
2. [Управление на Профил](#управление-на-профил)
3. [Създаване на Тренировки](#създаване-на-тренировки)
4. [AI Workout Builder](#ai-workout-builder)
5. [Проследяване на Упражнения](#проследяване-на-упражнения)
6. [Прогрес и Измервания](#прогрес-и-измервания)
7. [Хранителен План](#хранителен-план)
8. [Real-time Updates](#real-time-updates)

---

## 🔐 Автентикация

### Регистрация на Нов Потребител

```javascript
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

async function registerUser() {
  try {
    // 1. Създаване на акаунт
    const { data, error } = await supabase.auth.signUp({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      options: {
        data: {
          full_name: 'Иван Иванов',
          date_of_birth: '1990-01-15'
        }
      }
    });

    if (error) throw error;

    // 2. Автоматично се създава профил в базата данни
    toast.success('Регистрацията е успешна! Проверете имейла си за потвърждение.');
    
    // 3. Пренасочване към verify-email страница
    router.push('/auth/verify-email');
    
  } catch (error) {
    toast.error(error.message);
  }
}
```

### Email Верификация

```javascript
async function verifyEmail(code) {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email: userEmail,
      token: code,
      type: 'signup'
    });

    if (error) throw error;

    toast.success('Имейлът е потвърден успешно!');
    router.push('/dashboard');
    
  } catch (error) {
    toast.error('Невалиден код за потвърждение');
  }
}
```

### Вход в Системата

```javascript
async function loginUser() {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'user@example.com',
      password: 'SecurePassword123!'
    });

    if (error) throw error;

    // AuthProvider автоматично ще зареди потребителските данни
    toast.success('Успешен вход!');
    router.push('/dashboard');
    
  } catch (error) {
    if (error.message.includes('Invalid login')) {
      toast.error('Грешен имейл или парола');
    } else {
      toast.error(error.message);
    }
  }
}
```

### Изход от Системата

```javascript
import { useAuthStore } from '@/stores/auth/useAuthStore';

async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Изчистване на local state
    useAuthStore.getState().clearUser();
    
    toast.success('Успешен изход');
    router.push('/');
    
  } catch (error) {
    toast.error('Грешка при изход от системата');
  }
}
```

---

## 👤 Управление на Профил

### Обновяване на Профилна Информация

```javascript
import { updateUserProfile } from '@/lib/services/userService';
import { useAuthStore } from '@/stores/auth/useAuthStore';

async function updateProfile() {
  const { user, updateProfile } = useAuthStore();
  
  const profileData = {
    full_name: 'Иван Петров',
    height_cm: 180,
    weight_kg: 75.5,
    date_of_birth: '1990-01-15',
    gender: 'male',
    fitness_goals: 'muscle_gain',
    experience_level: 'intermediate',
    activity_level: 'moderately_active',
    bio: 'Фитнес ентусиаст от 5 години'
  };

  try {
    const result = await updateProfile(profileData);
    
    if (result.success) {
      toast.success('Профилът е обновен успешно!');
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    toast.error('Грешка при обновяване на профила');
  }
}
```

### Задаване на Фитнес Цели

```javascript
import { upsertUserGoal } from '@/lib/services/userService';

async function setFitnessGoals() {
  const goals = {
    goal_type: 'muscle_gain',
    target_weight_kg: 80,
    target_body_fat_percentage: 12,
    target_date: '2025-12-31',
    weekly_workout_frequency: 4,
    daily_calorie_goal: 3000,
    is_active: true
  };

  try {
    const { data, error } = await upsertUserGoal(user.id, goals);
    
    if (error) throw error;
    
    toast.success('Целите са зададени успешно!');
    
    // Изчисляване на прогрес
    const daysToGoal = Math.ceil(
      (new Date(goals.target_date) - new Date()) / (1000 * 60 * 60 * 24)
    );
    
    console.log(`Дни до целта: ${daysToGoal}`);
    
  } catch (error) {
    toast.error('Грешка при задаване на цели');
  }
}
```

### Качване на Профилна Снимка

```javascript
async function uploadAvatar(file) {
  if (!file) return;

  try {
    // 1. Upload към Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Получаване на public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 3. Обновяване на профила
    const { error: updateError } = await updateUserProfile(user.id, {
      avatar_url: publicUrl
    });

    if (updateError) throw updateError;

    toast.success('Снимката е качена успешно!');
    
  } catch (error) {
    toast.error('Грешка при качване на снимка');
  }
}
```

---

## 💪 Създаване на Тренировки

### Създаване на Нова Тренировка

```javascript
import { createWorkout } from '@/lib/services/workoutService';

async function createNewWorkout() {
  const workoutData = {
    name: 'Upper Body Strength',
    workout_date: new Date().toISOString().split('T')[0],
    workout_type: ['strength', 'upper_body'],
    estimated_duration_minutes: 60,
    notes: 'Focus on progressive overload',
    status: 'planned'
  };

  try {
    const { data: workout, error } = await createWorkout(user.id, workoutData);
    
    if (error) throw error;

    toast.success('Тренировката е създадена!');
    router.push(`/workout-detail/${workout.id}`);
    
  } catch (error) {
    toast.error('Грешка при създаване на тренировка');
  }
}
```

### Добавяне на Упражнения към Тренировка

```javascript
import { addExerciseToWorkout } from '@/lib/services/workoutService';

async function addExercises(workoutId) {
  const exercises = [
    {
      exerciseId: 'bench-press-id',
      order_index: 1,
      default_sets: 4,
      default_reps_min: 8,
      default_reps_max: 10,
      default_weight_kg: 60,
      default_rest_seconds: 120,
      notes: 'Control the descent, explosive push'
    },
    {
      exerciseId: 'incline-dumbbell-press-id',
      order_index: 2,
      default_sets: 3,
      default_reps_min: 10,
      default_reps_max: 12,
      default_weight_kg: 22.5,
      default_rest_seconds: 90
    }
  ];

  try {
    for (const exercise of exercises) {
      const { error } = await addExerciseToWorkout(
        workoutId,
        exercise.exerciseId,
        exercise
      );
      
      if (error) throw error;
    }

    toast.success('Упражненията са добавени!');
    
  } catch (error) {
    toast.error('Грешка при добавяне на упражнения');
  }
}
```

### Създаване на Тренировка от Шаблон

```javascript
import { createWorkoutFromTemplate } from '@/lib/services/workoutService';

async function useTemplate(templateId) {
  const workoutDate = new Date().toISOString().split('T')[0];

  try {
    const { data: workout, error } = await createWorkoutFromTemplate(
      user.id,
      templateId,
      workoutDate
    );

    if (error) throw error;

    toast.success('Тренировката е създадена от шаблон!');
    router.push(`/workout-detail/${workout.id}`);
    
  } catch (error) {
    toast.error('Грешка при използване на шаблон');
  }
}
```

---

## 🤖 AI Workout Builder

### Пълен AI Assessment и Генериране

```javascript
import { useWorkoutStore } from '@/stores/workout/useWorkoutStore';

function AIWorkoutBuilder() {
  const { setAssessment, generateAIWorkout } = useWorkoutStore();
  
  // Стъпка 1: Събиране на информация
  const assessment = {
    experienceLevel: 'intermediate',
    goals: ['muscle_gain', 'strength'],
    availability: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: false
    },
    equipment: ['barbell', 'dumbbells', 'pull_up_bar', 'cables'],
    preferences: {
      sessionDuration: 60,
      avoidExercises: ['deadlifts'], // при травма
      focusAreas: ['chest', 'back', 'shoulders']
    }
  };

  // Стъпка 2: Генериране на AI тренировка
  async function generateWorkout() {
    try {
      setAssessment(assessment);
      
      // Симулация на AI генериране
      const aiWorkout = await generateAIWorkout();
      
      // Резултат
      const workout = {
        name: 'AI Generated: Upper/Lower Split',
        description: 'Progressive 4-day split for muscle gain',
        workouts: [
          {
            day: 'Monday',
            name: 'Upper Power',
            exercises: [
              {
                name: 'Bench Press',
                sets: 5,
                reps: '3-5',
                restSeconds: 180,
                notes: 'Heavy weight, focus on power'
              },
              {
                name: 'Weighted Pull-ups',
                sets: 4,
                reps: '5-8',
                restSeconds: 150
              }
              // ... още упражнения
            ]
          },
          // ... останалите дни
        ],
        weeklyVolume: {
          chest: 16,
          back: 16,
          shoulders: 12,
          legs: 20
        },
        estimatedResults: '2-3kg muscle gain in 3 months'
      };

      toast.success('AI тренировката е генерирана!');
      return workout;
      
    } catch (error) {
      toast.error('Грешка при генериране на AI тренировка');
    }
  }
}
```

---

## 🏋️ Проследяване на Упражнения

### Започване на Тренировъчна Сесия

```javascript
import { updateWorkout } from '@/lib/services/workoutService';

async function startWorkoutSession(workoutId) {
  try {
    const { data, error } = await updateWorkout(workoutId, {
      status: 'in_progress',
      started_at: new Date().toISOString()
    });

    if (error) throw error;

    // Стартиране на таймер
    startWorkoutTimer();
    
    toast.success('Тренировката започна! Успех! 💪');
    
  } catch (error) {
    toast.error('Грешка при стартиране на тренировка');
  }
}
```

### Логване на Сетове

```javascript
import { addSetToExercise } from '@/lib/services/workoutService';

async function logSet(workoutExerciseId, setData) {
  const set = {
    set_number: 1,
    set_type: 'working', // 'warmup', 'working', 'dropset', etc.
    reps: 10,
    weight_kg: 60,
    rpe: 8, // Rate of Perceived Exertion (1-10)
    rest_duration_seconds: 120,
    is_completed: true,
    completed_at: new Date().toISOString()
  };

  try {
    const { data, error } = await addSetToExercise(workoutExerciseId, set);
    
    if (error) throw error;

    // Проверка за личен рекорд
    if (data.is_pr) {
      toast.success('🎉 Нов личен рекорд!');
      celebrateAchievement();
    } else {
      toast.success('Сетът е записан');
    }
    
  } catch (error) {
    toast.error('Грешка при записване на сет');
  }
}
```

### Завършване на Тренировка

```javascript
async function completeWorkout(workoutId, exercises) {
  try {
    // Изчисляване на обща статистика
    const totalVolume = exercises.reduce((sum, exercise) => {
      return sum + exercise.sets.reduce((setSum, set) => {
        return setSum + (set.weight_kg * set.reps);
      }, 0);
    }, 0);

    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const duration = calculateDuration(startTime, new Date());

    const { data, error } = await updateWorkout(workoutId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      total_duration_minutes: duration,
      total_volume_kg: totalVolume,
      total_sets: totalSets,
      perceived_exertion: 8,
      session_rating: 5,
      notes: 'Great workout! Feeling strong.'
    });

    if (error) throw error;

    toast.success('Тренировката е завършена! Браво! 🎉');
    
    // Показване на summary
    showWorkoutSummary({
      duration,
      volume: totalVolume,
      sets: totalSets,
      exercises: exercises.length
    });
    
  } catch (error) {
    toast.error('Грешка при завършване на тренировка');
  }
}
```

---

## 📊 Прогрес и Измервания

### Добавяне на Телесни Измервания

```javascript
import { createMeasurement } from '@/lib/services/progressService';

async function recordMeasurements() {
  const measurements = {
    measurement_date: new Date().toISOString().split('T')[0],
    weight_kg: 76.2,
    body_fat_percentage: 14.8,
    muscle_mass_kg: 64.7,
    water_percentage: 60.2,
    
    // Обиколки в cm
    neck_cm: 38,
    chest_cm: 102,
    waist_cm: 81,
    hips_cm: 98,
    bicep_left_cm: 36,
    bicep_right_cm: 36.5,
    thigh_left_cm: 58,
    thigh_right_cm: 58,
    calf_left_cm: 38,
    calf_right_cm: 38,
    
    notes: 'Morning measurement, before breakfast'
  };

  try {
    const { data, error } = await createMeasurement(user.id, measurements);
    
    if (error) throw error;

    // Анализ на промените
    const previousMeasurement = await getPreviousMeasurement(user.id);
    if (previousMeasurement) {
      const weightChange = measurements.weight_kg - previousMeasurement.weight_kg;
      const fatChange = measurements.body_fat_percentage - previousMeasurement.body_fat_percentage;
      
      if (weightChange > 0 && fatChange < 0) {
        toast.success('Отлична работа! Качваш мускулна маса! 💪');
      }
    }
    
  } catch (error) {
    toast.error('Грешка при записване на измервания');
  }
}
```

### Качване на Progress Снимки

```javascript
import { uploadProgressPhoto, createProgressPhoto } from '@/lib/services/progressService';

async function uploadProgressPicture(file, photoType) {
  try {
    // 1. Upload файла
    const { data: uploadData, error: uploadError } = await uploadProgressPhoto(file);
    
    if (uploadError) throw uploadError;

    // 2. Запис в базата данни
    const { data, error } = await createProgressPhoto(user.id, {
      photo_url: uploadData.publicUrl,
      photo_type: photoType, // 'front', 'back', 'side_left', 'side_right'
      photo_date: new Date().toISOString().split('T')[0],
      measurement_id: currentMeasurementId, // optional link to measurement
      description: 'Week 8 progress',
      is_public: false
    });

    if (error) throw error;

    toast.success('Снимката е качена успешно!');
    
    // Създаване на comparison view
    if (photoType === 'front') {
      createProgressComparison(data.id);
    }
    
  } catch (error) {
    toast.error('Грешка при качване на снимка');
  }
}
```

### Проверка за Постижения

```javascript
import { checkUserAchievements } from '@/lib/services/progressService';

async function checkForAchievements() {
  try {
    const { data: achievements, error } = await checkUserAchievements(user.id);
    
    if (error) throw error;

    const newAchievements = achievements.filter(a => a.is_new);
    
    if (newAchievements.length > 0) {
      // Показване на celebration modal
      showAchievementModal(newAchievements);
      
      // Обновяване на точки
      const totalPoints = newAchievements.reduce((sum, a) => sum + a.points, 0);
      updateUserPoints(totalPoints);
      
      // Notification
      newAchievements.forEach(achievement => {
        toast.success(`🏆 ${achievement.name}: ${achievement.description}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}
```

---

## 🍎 Хранителен План

### Създаване на Хранителни Цели

```javascript
import { createNutritionGoal } from '@/lib/services/nutritionService';

async function setNutritionGoals() {
  // Изчисляване на калории базирано на TDEE
  const tdee = calculateTDEE({
    weight: 76,
    height: 180,
    age: 30,
    gender: 'male',
    activityLevel: 'moderately_active'
  });

  const goals = {
    goal_type: 'muscle_gain',
    calories_target: tdee + 300, // surplus за мускулен растеж
    protein_target_g: 76 * 2.2, // 2.2g per kg body weight
    carbs_target_g: 300,
    fat_target_g: 80,
    fiber_target_g: 35,
    water_target_liters: 3,
    
    // Разпределение на храненията
    breakfast_percentage: 25,
    lunch_percentage: 35,
    dinner_percentage: 30,
    snacks_percentage: 10,
    
    effective_date: new Date().toISOString().split('T')[0],
    is_active: true
  };

  try {
    const { data, error } = await createNutritionGoal(user.id, goals);
    
    if (error) throw error;

    toast.success('Хранителните цели са зададени!');
    
    // Генериране на примерен план
    generateMealPlan(goals);
    
  } catch (error) {
    toast.error('Грешка при задаване на хранителни цели');
  }
}
```

### Логване на Хранене

```javascript
import { createMeal, addFoodToMeal } from '@/lib/services/nutritionService';

async function logMeal() {
  try {
    // 1. Създаване на хранене
    const { data: meal, error: mealError } = await createMeal(user.id, {
      name: 'Post-Workout Meal',
      meal_type: 'post_workout',
      meal_date: new Date().toISOString().split('T')[0],
      consumed_at: new Date().toISOString(),
      location: 'home',
      notes: 'Within 30 min after training'
    });

    if (mealError) throw mealError;

    // 2. Добавяне на храни
    const foods = [
      { food_id: 'chicken-breast-id', quantity: 200, unit: 'g' },
      { food_id: 'white-rice-id', quantity: 150, unit: 'g' },
      { food_id: 'broccoli-id', quantity: 100, unit: 'g' },
      { food_id: 'olive-oil-id', quantity: 10, unit: 'ml' }
    ];

    for (const food of foods) {
      const { error } = await addFoodToMeal(meal.id, food);
      if (error) console.error('Error adding food:', error);
    }

    // 3. Изчисляване на макроси
    const macros = await calculateMealMacros(meal.id);
    
    toast.success(`Хранене записано: ${macros.calories} kcal`);
    
    // 4. Проверка дали целите са постигнати
    checkDailyNutritionGoals();
    
  } catch (error) {
    toast.error('Грешка при записване на хранене');
  }
}
```

### Проследяване на Вода

```javascript
import { logWaterIntake } from '@/lib/services/nutritionService';

async function trackWater(amount) {
  try {
    const { data, error } = await logWaterIntake(user.id, {
      amount_ml: amount,
      source_type: 'water', // 'water', 'tea', 'coffee', etc.
      consumed_at: new Date().toISOString()
    });

    if (error) throw error;

    // Обновяване на daily progress
    const totalToday = await getTodayWaterIntake(user.id);
    const percentage = (totalToday / 3000) * 100; // 3L goal
    
    updateWaterProgress(percentage);
    
    if (percentage >= 100) {
      toast.success('🎉 Дневната цел за вода е постигната!');
    } else {
      toast.success(`💧 ${amount}ml добавени. Общо: ${totalToday}ml`);
    }
    
  } catch (error) {
    toast.error('Грешка при записване на вода');
  }
}
```

---

## 🔄 Real-time Updates

### Следене на Тренировки в Реално Време

```javascript
import { supabase } from '@/lib/supabase/client';

function useWorkoutSubscription(userId) {
  useEffect(() => {
    // Subscribe to workout changes
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
          console.log('Workout update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              toast.info('Нова тренировка добавена');
              addWorkoutToList(payload.new);
              break;
              
            case 'UPDATE':
              updateWorkoutInList(payload.new);
              if (payload.new.status === 'completed') {
                toast.success('Тренировка завършена!');
              }
              break;
              
            case 'DELETE':
              removeWorkoutFromList(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
}
```

### Live Progress Tracking

```javascript
function useLiveProgress(workoutId) {
  const [liveStats, setLiveStats] = useState({
    completedSets: 0,
    totalSets: 0,
    currentExercise: null,
    timeElapsed: 0
  });

  useEffect(() => {
    const channel = supabase
      .channel(`workout-${workoutId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'exercise_sets',
          filter: `workout_exercise_id=in.(${exerciseIds.join(',')})`
        },
        (payload) => {
          // Обновяване на live статистика
          setLiveStats(prev => ({
            ...prev,
            completedSets: prev.completedSets + 1
          }));
          
          // Анимация за completed set
          animateSetCompletion(payload.new);
        }
      )
      .subscribe();

    // Timer за elapsed time
    const timer = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1
      }));
    }, 1000);

    return () => {
      channel.unsubscribe();
      clearInterval(timer);
    };
  }, [workoutId]);

  return liveStats;
}
```

### Presence - Кой Тренира Сега

```javascript
function useGymPresence() {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const channel = supabase.channel('gym-presence');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat();
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        toast.info(`${newPresences[0].username} започна тренировка`);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        toast.info(`${leftPresences[0].username} завърши тренировка`);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            username: user.full_name,
            workout_type: currentWorkout.name,
            started_at: new Date().toISOString()
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return activeUsers;
}
```

---

## 🎯 Съвети и Трикове

### Performance Оптимизация

```javascript
// Използвайте React Query или SWR за caching
import useSWR from 'swr';

function useWorkouts(userId) {
  const { data, error, mutate } = useSWR(
    `/api/workouts/${userId}`,
    () => getUserWorkouts(userId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0
    }
  );

  return {
    workouts: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
```

### Error Boundary за по-добър UX

```javascript
class WorkoutErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Workout error:', error, errorInfo);
    toast.error('Възникна грешка. Моля опитайте отново.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-6 text-center">
          <h2>Нещо се обърка</h2>
          <Button onClick={() => window.location.reload()}>
            Презареди страницата
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
```

### Offline Support

```javascript
// Запазване на данни локално за offline режим
function useOfflineSync() {
  const syncQueue = useRef([]);

  const addToQueue = (action) => {
    syncQueue.current.push(action);
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue.current));
  };

  const syncWhenOnline = async () => {
    if (!navigator.onLine) return;

    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    
    for (const action of queue) {
      try {
        await executeAction(action);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }

    localStorage.removeItem('syncQueue');
    toast.success('Данните са синхронизирани');
  };

  useEffect(() => {
    window.addEventListener('online', syncWhenOnline);
    return () => window.removeEventListener('online', syncWhenOnline);
  }, []);

  return { addToQueue };
}
```

---

*Последна актуализация: Януари 2025*
*За още примери вижте [API Документацията](API_DOCUMENTATION.md)*