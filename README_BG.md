# 🏋️ GymPlanner - Модерно Фитнес Приложение

<div align="center">
  <img src="public/logo.png" alt="GymPlanner Logo" width="200" />
  
  <p align="center">
    <strong>Вашият персонален AI фитнес асистент</strong>
  </p>
  
  <p align="center">
    <a href="#функционалности">Функционалности</a> •
    <a href="#технологии">Технологии</a> •
    <a href="#инсталация">Инсталация</a> •
    <a href="#документация">Документация</a> •
    <a href="#демо">Демо</a>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Supabase-2.50-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind" />
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License" />
  </p>
</div>

---

## 🎯 Преглед

**GymPlanner** е модерно уеб приложение за управление на фитнес тренировки, хранене и проследяване на прогреса. С помощта на AI технологии, приложението създава персонализирани тренировъчни планове и предоставя интелигентни препоръки за постигане на вашите фитнес цели.

### 🌟 Ключови Предимства

- **🤖 AI Workout Builder** - Автоматично генериране на тренировки базирано на вашите цели
- **📊 Детайлно Проследяване** - Следете прогреса си с подробни графики и статистики
- **🍎 Хранителен Планер** - Балансирани хранителни планове за оптимални резултати
- **📱 Mobile-First Дизайн** - Перфектно работи на всички устройства
- **🌙 Тъмна/Светла Тема** - Комфорт за очите по всяко време

---

## ✨ Функционалности

### 🏋️‍♂️ Тренировки
- **AI генериране на тренировки** с 5-стъпков assessment процес
- **20+ предварително заредени упражнения** с видео демонстрации
- **Form cues и common mistakes** за всяко упражнение
- **Проследяване на сетове и повторения** в реално време
- **Workout templates** за повторна употреба

### 📈 Прогрес
- **Телесни измервания** - тегло, мазнини, мускулна маса
- **Progress photos** с timeline view
- **Personal records** tracking
- **Achievement система** с badges и точки
- **Седмични и месечни отчети**

### 🥗 Хранене
- **База данни с храни** и хранителни стойности
- **Meal planning** с макроси
- **Calorie tracking** с дневни цели
- **Water intake** проследяване
- **Recipe builder** за custom ястия

### 👤 Профил
- **Детайлни фитнес профили**
- **Goal setting** - загуба на тегло, мускулна маса, сила
- **Experience levels** - beginner до advanced
- **Персонализирани настройки**
- **Email верификация** за сигурност

---

## 🛠️ Технологии

### Frontend
- **[Next.js 15.3](https://nextjs.org/)** - React framework с App Router
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Модерни UI компоненти
- **[Zustand](https://github.com/pmndrs/zustand)** - State management
- **[Lucide Icons](https://lucide.dev/)** - Красиви SVG икони

### Backend
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL база данни
  - Автентикация
  - Real-time subscriptions
  - Storage за медийни файлове
  - Edge Functions

### DevOps
- **Vercel** - Hosting и CI/CD
- **GitHub Actions** - Automated workflows
- **ESLint + Prettier** - Code quality

---

## 🚀 Инсталация

### Предварителни Изисквания

- Node.js 18+
- npm/yarn/pnpm
- Supabase акаунт
- Git

### Стъпки

1. **Клонирайте репозиторито**
```bash
git clone https://github.com/your-username/gym-planner.git
cd gym-planner
```

2. **Инсталирайте зависимостите**
```bash
npm install
# или
yarn install
# или
pnpm install
```

3. **Настройте environment variables**
```bash
cp .env.example .env.local
```

Редактирайте `.env.local` със вашите Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Настройте базата данни**
```bash
# Инсталирайте Supabase CLI
npm install -g supabase

# Инициализирайте Supabase
supabase init

# Стартирайте локална инстанция (опционално)
supabase start

# Приложете миграциите
supabase db push
```

5. **Стартирайте development server**
```bash
npm run dev
```

Отворете [http://localhost:3000](http://localhost:3000) във вашия браузър.

---

## 📚 Документация

### Основна Документация
- 📖 [Техническа Документация](TECHNICAL_DOCUMENTATION.md) - Пълен технически guide
- 🗄️ [База Данни Схема](DATABASE_SCHEMA.md) - Детайлна схема на таблиците
- 🧩 [Компоненти](COMPONENTS_DOCUMENTATION.md) - UI компоненти с примери
- 🌐 [API Документация](API_DOCUMENTATION.md) - REST API endpoints

### Допълнителни Ресурси
- 📋 [Пълно Ръководство](GYM_PLANNER_COMPLETE_GUIDE.md) - Comprehensive guide
- 🏗️ [Структура на Проекта](PROJECT_STRUCTURE.md) - Файлова организация
- 📝 [План за Имплементация](IMPLEMENTATION_PLAN.md) - Roadmap

---

## 🎮 Използване

### 1. Регистрация и Профил

```javascript
// Създайте нов акаунт
const { user } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword'
})

// Попълнете профила си
await updateUserProfile(user.id, {
  full_name: 'Иван Иванов',
  height_cm: 180,
  weight_kg: 75,
  fitness_goals: 'muscle_gain'
})
```

### 2. Създаване на AI Тренировка

```javascript
// Използвайте AI Builder
const workout = await generateAIWorkout({
  experienceLevel: 'intermediate',
  goals: ['strength', 'muscle_gain'],
  equipment: ['barbell', 'dumbbells'],
  daysPerWeek: 4,
  sessionDuration: 60
})
```

### 3. Проследяване на Прогрес

```javascript
// Добавете измервания
await createMeasurement(userId, {
  weight_kg: 76,
  body_fat_percentage: 15,
  measurement_date: new Date()
})

// Качете progress снимка
await uploadProgressPhoto(file, {
  photo_type: 'front',
  description: '2 месеца прогрес'
})
```

---

## 🖼️ Демо

### Dashboard
![Dashboard Screenshot](public/screenshots/dashboard.png)

### AI Workout Builder
![AI Builder Screenshot](public/screenshots/ai-builder.png)

### Exercise Library
![Exercises Screenshot](public/screenshots/exercises.png)

### Progress Tracking
![Progress Screenshot](public/screenshots/progress.png)

---

## 🗺️ Roadmap

### Phase 1 ✅ (Завършена)
- [x] Основна структура и setup
- [x] Автентикация система
- [x] Dashboard с основни функции
- [x] AI Workout Builder
- [x] Exercise library

### Phase 2 🔄 (В процес)
- [ ] Workout session tracking
- [ ] Nutrition tracking
- [ ] Progress photos upload
- [ ] Achievement система

### Phase 3 📋 (Планирана)
- [ ] Mobile app (React Native)
- [ ] Social features
- [ ] Premium subscriptions
- [ ] Wearable integrations

### Phase 4 🚀 (Бъдеще)
- [ ] Advanced AI coach
- [ ] Video analysis
- [ ] Marketplace за coaches
- [ ] Multi-language support

---

## 🤝 Принос към Проекта

Приветстваме приноса на общността! Вижте нашия [Contributing Guide](CONTRIBUTING.md) за повече информация.

### Как да помогнете

1. Fork проекта
2. Създайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit промените (`git commit -m 'Add some AmazingFeature'`)
4. Push към branch (`git push origin feature/AmazingFeature`)
5. Отворете Pull Request

### Code Style

- Използваме ESLint и Prettier
- Следвайте съществуващите patterns
- Пишете ясни commit messages
- Добавяйте тестове за нови функции

---

## 🐛 Известни Проблеми

- Session timeout warning може да се появи преждевременно
- Upload на големи видеа може да отнеме време
- PWA функционалност още не е имплементирана

Вижте [Issues](https://github.com/your-username/gym-planner/issues) за пълен списък.

---

## 📄 Лиценз

Този проект е лицензиран под MIT License - вижте [LICENSE](LICENSE) файла за детайли.

---

## 🙏 Благодарности

- [shadcn](https://twitter.com/shadcn) за невероятните UI компоненти
- [Supabase](https://supabase.com) team за страхотния BaaS
- [Vercel](https://vercel.com) за безпроблемния hosting
- Всички contributors и beta testers

---

## 📞 Контакт

**Име на Проекта:** GymPlanner  
**Email:** support@gymplanner.com  
**Website:** [gymplanner.com](https://gymplanner.com)

**Социални Мрежи:**
- Twitter: [@gymplanner](https://twitter.com/gymplanner)
- Instagram: [@gymplannerapp](https://instagram.com/gymplannerapp)

---

<div align="center">
  <p>Направено с ❤️ от фитнес ентусиасти за фитнес ентусиасти</p>
  <p>⭐ Харесайте проекта, ако ви е полезен!</p>
</div>