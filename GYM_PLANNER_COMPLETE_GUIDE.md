# 🏋️ GymPlanner - Пълен Ръководител на Проекта

## 📋 Преглед на Проекта

GymPlanner е съвременно уеб приложение за фитнес управление, построено с Next.js 14 и Supabase. Приложението предоставя пълна платформа за проследяване на тренировки, хранене, прогрес и постигане на фитнес цели с AI асистент.

### 🎯 Основни Цели
- **Персонализирано фитнес управление** - Индивидуални планове за тренировки и хранене
- **AI асистент** - Интелигентни препоръки и автоматизация
- **Детайлно проследяване** - Прогрес, измервания, постижения
- **Съвременен UI/UX** - Мобил-първи дизайн с тъмна/светла тема
- **Социални функции** - Споделяне на тренировки и прогрес

---

## 🗂️ Структура на Проекта

### Технологии
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Стилизиране**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Валидация**: Zod
- **Типове**: JavaScript с планове за TypeScript

### Файлова Структура

```
gym-planner/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (authenticated)/          # Защитени routes
│   │   │   ├── dashboard/            # Главно табло
│   │   │   ├── workout-builder/      # AI тренировъчен строител
│   │   │   └── diet-builder/         # Хранителен планировчик
│   │   ├── (public)/                 # Публични routes
│   │   │   └── auth/                 # Автентикация
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.jsx
│   │
│   ├── components/                   # Компоненти
│   │   ├── ui/                      # shadcn/ui базови компоненти
│   │   ├── common/                  # Споделени компоненти
│   │   │   ├── navigation/          # Навигация и sidebar
│   │   │   ├── layout/              # Layout компоненти
│   │   │   └── theme/               # Тема и режими
│   │   └── features/                # Функционалност-специфични
│   │       ├── auth/                # Автентикация
│   │       ├── dashboard/           # Главно табло
│   │       ├── workout/             # Тренировки
│   │       └── diet/                # Хранене
│   │
│   ├── lib/                         # Библиотеки и утилити
│   │   ├── supabase/               # Supabase клиенти
│   │   ├── services/               # API сървиси
│   │   ├── utils/                  # Помощни функции
│   │   └── config/                 # Конфигурация
│   │
│   ├── hooks/                       # React hooks
│   │   ├── auth/                   # Автентикация hooks
│   │   ├── ui/                     # UI hooks
│   │   └── api/                    # API hooks
│   │
│   ├── stores/                      # Zustand state управление
│   │   ├── auth/                   # Auth store
│   │   ├── workout/                # Workout store
│   │   ├── diet/                   # Diet store
│   │   └── progress/               # Progress store
│   │
│   ├── providers/                   # React Context providers
│   └── types/                       # Типови дефиниции
│
├── supabase/                        # Supabase конфигурация
│   ├── migrations/                  # Database миграции
│   └── functions/                   # Edge функции
│
└── public/                          # Статични файлове
```

---

## 🗃️ База Данни Структура

### Основни Модули

#### 1. 👤 Потребители и Профили
- **profiles** - Основни потребителски профили
- **user_goals** - Фитнес цели (отслабване, мускулна маса, сила)
- **user_preferences** - Настройки на приложението

#### 2. 💪 Тренировки и Упражнения  
- **exercises** - База данни с 20+ упражнения с AI съвети
- **muscle_groups** - Мускулни групи
- **equipment** - Оборудване за упражненията
- **workout_templates** - Шаблони за тренировки
- **user_workouts** - Действителни тренировки
- **workout_exercises** - Упражнения в тренировки
- **exercise_sets** - Индивидуални сетове

#### 3. 📊 Проследяване на Прогреса
- **user_measurements** - Телесни измервания
- **daily_stats** - Ежедневна статистика
- **exercise_personal_records** - Лични рекорди
- **achievement_definitions** - Дефиниции на постижения
- **user_achievements** - Потребителски постижения
- **progress_photos** - Прогресни снимки

#### 4. 🍎 Система за Хранене
- **food_items** - База данни с храни
- **food_categories** - Категории храни
- **nutrition_goals** - Хранителни цели
- **meal_templates** - Шаблони за хранения
- **user_meals** - Действителни хранения
- **meal_foods** - Храни в хранения
- **water_intake** - Прием на вода

### Ключови Особености на Базата Данни

#### 🔒 Сигурност
- **Row Level Security (RLS)** на всички таблици
- Потребителите виждат само собствените си данни
- Публични ресурси (упражнения, храни) достъпни за всички

#### 🚀 Производителност
- Индекси за всички user_id + date заявки
- GIN индекси за array полета (мускулни групи, тагове)
- Оптимизирани заявки за най-чести операции

#### 🤖 AI Функционалности
- **form_cues** - AI-генерирани съвети за форма
- **ai_difficulty_score** - AI оценка на трудността
- **ai_suggestions** - Интелигентни препоръки
- **common_mistakes** - Често срещани грешки

#### 📁 Медийни Файлове
- **Supabase Storage** интеграция
- Bucket за упражнения (видеа/снимки)
- Bucket за корици на тренировки
- Автоматично управление на файлове

---

## 📋 План за Имплементация

### ✅ Phase 1: Database Schema (ЗАВЪРШЕНА)
- [x] Миграции за всички таблици
- [x] RLS политики
- [x] 20+ примерни упражнения с AI данни
- [x] Storage buckets за медия

### ✅ Phase 2: Основна Структура (ЗАВЪРШЕНА)
- [x] Next.js 14 setup с App Router
- [x] Supabase интеграция
- [x] shadcn/ui компоненти
- [x] Zustand stores
- [x] Автентикация система

### ✅ Phase 3: Core Features (90% ЗАВЪРШЕНИ)

#### ✅ Автентикация (Пълна)
- [x] Login/Register форми с валидация
- [x] Email верификация
- [x] Session управление
- [x] Route protection
- [x] Auth store

#### ✅ Dashboard (Пълна)
- [x] Today's Summary
- [x] Weekly Goals с прогрес
- [x] BMI калкулатор
- [x] Progress charts
- [x] Quick Actions (8 действия)
- [x] Recent/Upcoming workouts
- [x] AI Builder cards

#### ✅ AI Workout Builder (Пълна)
- [x] 5-стъпков assessment процес
- [x] Auto-population от профил данни
- [x] AI генериране с loading states
- [x] 3-колонен editing интерфейс
- [x] 20+ упражнения с AI form cues
- [x] Реално време статистики

#### ✅ Навигация (Пълна)
- [x] Responsive sidebar
- [x] Authenticated layout
- [x] Breadcrumbs
- [x] Dark/light theme toggle
- [x] Mobile-first дизайн

### 🔄 Phase 4: Advanced Features (В Процес)

#### 🔄 Workout Management (70%)
- [x] Workout templates
- [x] Exercise library
- [ ] Workout session tracking
- [ ] Set logging
- [ ] Progress photos

#### 📋 Diet Builder (Планиран)
- [ ] Food database интеграция
- [ ] Meal planning
- [ ] Nutrition tracking
- [ ] Calorie goals
- [ ] Water intake logging

#### 📊 Progress Tracking (Планиран)
- [ ] Body measurements
- [ ] Progress charts
- [ ] Personal records
- [ ] Achievement system
- [ ] Progress photos

#### 👥 Social Features (Планиран)
- [ ] Public profiles
- [ ] Workout sharing
- [ ] Achievement sharing
- [ ] Follow users
- [ ] Activity feed

---

## 🏗️ API Services и Интеграции

### Supabase Services
```javascript
// lib/services/
├── userService.js       # Потребителски профили
├── workoutService.js    # Тренировки и упражнения
├── exerciseService.js   # Exercise library
├── progressService.js   # Measurements и tracking
├── nutritionService.js  # Храни и хранения
└── index.js            # Export всички services
```

### Key API Функции

#### User Service
- `getUserProfile(userId)` - Получаване на профил
- `updateUserProfile(userId, data)` - Обновяване на профил
- `getUserGoals(userId)` - Получаване на цели
- `createUserGoal(userId, goalData)` - Създаване на цел

#### Workout Service
- `getExerciseLibrary(filters)` - Exercise library с филтри
- `createWorkoutTemplate(userId, templateData)` - Създаване на шаблон
- `startWorkout(userId, templateId)` - Започване на тренировка
- `logExerciseSet(workoutExerciseId, setData)` - Логване на сет

#### Progress Service
- `getUserMeasurements(userId, dateRange)` - Измервания
- `logMeasurement(userId, measurementData)` - Логване на измерване
- `getDailyStats(userId, date)` - Дневна статистика

---

## 🎨 UI/UX Особености

### Дизайн Система
- **shadcn/ui** компоненти за консистентност
- **Tailwind CSS** за стилизиране
- **Lucide React** икони
- **Inter** шрифт за четливост

### Responsive Design
- **Mobile-first** подход
- Адаптивен sidebar (collapsible на mobile)
- Touch-friendly интерфейс
- Оптимизирани loading states

### Accessibility
- ARIA labels на всички интерактивни елементи
- Keyboard navigation
- Цветови контрасти за четливост
- Screen reader поддръжка

### Анимации
- Smooth transitions с Tailwind
- Loading skeletons
- Hover effects
- Page transitions

---

## 🔧 Development Workflow

### Локално Development
```bash
# Setup
npm install
npm run dev

# Supabase setup
npx supabase start
npx supabase db reset
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Testing Strategy
- **Unit tests** за utilities и helpers
- **Integration tests** за API services
- **E2E tests** за критични потребителски пътища
- **Manual testing** за UI/UX валидация

---

## 📈 Performance Optimizations

### Database
- Индекси за всички чести заявки
- Connection pooling
- Query оптимизация
- RLS политики за сигурност

### Frontend
- Next.js App Router за оптимално caching
- Image optimization с next/image
- Lazy loading на компоненти
- Bundle размер оптимизация

### Storage
- Supabase Storage за медийни файлове
- CDN за бърза доставка
- Компресия на изображения
- Progressive loading

---

## 🚀 Deployment Strategy

### Production Environment
- **Vercel** за frontend hosting
- **Supabase** за backend и database
- **Custom domain** с SSL
- **Analytics** интеграция

### CI/CD Pipeline
- GitHub Actions за automated testing
- Automated deployments на merge
- Environment-specific конфигурации
- Database migration управление

---

## 📊 Metrics и Analytics

### User Engagement
- Daily/Weekly/Monthly активни потребители
- Session duration
- Feature utilization
- Retention rates

### Performance Metrics
- Page load times
- API response times
- Error rates
- Uptime monitoring

### Business Metrics
- User registration rates
- Goal completion rates
- Feature adoption
- User satisfaction

---

## 🔮 Бъдещи Планове

### Short Term (1-2 месеца)
- [ ] Завършване на Progress Tracking
- [ ] Diet Builder имплементация
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

### Medium Term (3-6 месеца)
- [ ] Social features
- [ ] Premium subscription
- [ ] AI coach интеграция
- [ ] Wearable device sync

### Long Term (6+ месеца)
- [ ] Multi-language support
- [ ] Advanced AI features
- [ ] Marketplace за coaches
- [ ] Corporate wellness programs

---

## 🤝 Contributing

### Code Standards
- ESLint + Prettier конфигурация
- Consistent naming conventions
- Comprehensive commenting
- Git commit message standards

### Pull Request Process
1. Feature branch от main
2. Comprehensive testing
3. Code review process
4. Documentation update
5. Merge и deployment

---

## 📚 Documentation

### Internal Docs
- API documentation
- Component library
- Database schema reference
- Deployment guides

### User Documentation
- Getting started guide
- Feature tutorials
- FAQ section
- Video demonstrations

---

## 📞 Support и Maintenance

### Monitoring
- Error tracking (Sentry)
- Performance monitoring
- User feedback collection
- Regular health checks

### Updates
- Weekly dependency updates
- Monthly feature releases
- Quarterly major updates
- Annual technology reviews

---

*Последно обновление: Януари 2025*

*За въпроси или предложения, моля използвайте GitHub Issues или се свържете с development team-a.* 