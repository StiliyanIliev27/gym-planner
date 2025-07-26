# 🧩 GymPlanner - Документация на Компонентите

## 📑 Съдържание

1. [UI Компоненти](#ui-компоненти)
2. [Common Компоненти](#common-компоненти)
3. [Feature Компоненти](#feature-компоненти)
4. [Layout Компоненти](#layout-компоненти)
5. [Form Компоненти](#form-компоненти)
6. [Utility Компоненти](#utility-компоненти)

---

## 🎨 UI Компоненти (shadcn/ui)

### Button

Многофункционален бутон компонент с различни варианти и размери.

```jsx
import { Button } from "@/components/ui/button"

// Основни варианти
<Button>Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Размери
<Button size="default">Default Size</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <IconPlus className="h-4 w-4" />
</Button>

// С икона и текст
<Button>
  <IconPlus className="mr-2 h-4 w-4" />
  Add New
</Button>

// Loading state
<Button disabled>
  <Spinner className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>

// As child (за custom елементи)
<Button asChild>
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `asChild`: boolean - използва Radix UI Slot
- `disabled`: boolean
- `className`: string

---

### Card

Контейнер компонент за групиране на свързано съдържание.

```jsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Основна употреба
<Card>
  <CardHeader>
    <CardTitle>Workout Statistics</CardTitle>
    <CardDescription>Your progress this month</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Total workouts: 12</p>
    <p>Total volume: 15,420 kg</p>
  </CardContent>
  <CardFooter className="flex justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>

// С custom стилове
<Card className="w-[350px] shadow-lg">
  <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
    <CardTitle>Premium Feature</CardTitle>
  </CardHeader>
  <CardContent className="pt-6">
    <p>Unlock advanced analytics</p>
  </CardContent>
</Card>

// Clickable card
<Card className="cursor-pointer hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>Quick Workout</CardTitle>
  </CardHeader>
</Card>
```

---

### Dialog

Модален диалог за важни интеракции.

```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Основна употреба
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Edit Profile</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input id="name" className="col-span-3" />
      </div>
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Controlled dialog
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Input

Поле за въвеждане на текст.

```jsx
import { Input } from "@/components/ui/input"

// Основна употреба
<Input type="email" placeholder="Email" />

// С label
<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>

// Различни типове
<Input type="text" placeholder="Full name" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Age" min="0" max="100" />
<Input type="date" />
<Input type="file" />

// С икона
<div className="relative">
  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input placeholder="Search" className="pl-8" />
</div>

// Disabled и readonly
<Input disabled placeholder="Disabled input" />
<Input readOnly value="Read only value" />

// С error state
<Input className="border-destructive" placeholder="Invalid input" />
```

---

### Select

Dropdown компонент за избор на опция.

```jsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Основна употреба
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a goal" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fitness Goals</SelectLabel>
      <SelectItem value="weight_loss">Weight Loss</SelectItem>
      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
      <SelectItem value="strength">Strength</SelectItem>
      <SelectItem value="endurance">Endurance</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

// Controlled select
const [goal, setGoal] = useState("")

<Select value={goal} onValueChange={setGoal}>
  <SelectTrigger>
    <SelectValue placeholder="Choose your goal" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="weight_loss">Weight Loss</SelectItem>
    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
  </SelectContent>
</Select>

// С групи
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select equipment" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Free Weights</SelectLabel>
      <SelectItem value="barbell">Barbell</SelectItem>
      <SelectItem value="dumbbells">Dumbbells</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Machines</SelectLabel>
      <SelectItem value="cable">Cable Machine</SelectItem>
      <SelectItem value="smith">Smith Machine</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

---

### Progress

Показва прогрес или зареждане.

```jsx
import { Progress } from "@/components/ui/progress"

// Основна употреба
<Progress value={33} className="w-[60%]" />

// Динамичен прогрес
const [progress, setProgress] = useState(0)

useEffect(() => {
  const timer = setTimeout(() => setProgress(66), 500)
  return () => clearTimeout(timer)
}, [])

<Progress value={progress} className="w-full" />

// С label
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Daily Goal</span>
    <span>75%</span>
  </div>
  <Progress value={75} className="h-2" />
</div>

// Custom цветове
<Progress value={90} className="h-3 [&>div]:bg-green-500" />
```

---

### Badge

Малък етикет за категоризация или статус.

```jsx
import { Badge } from "@/components/ui/badge"

// Основни варианти
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// В контекст
<div className="flex items-center gap-2">
  <h3>Bench Press</h3>
  <Badge>Chest</Badge>
  <Badge variant="secondary">Compound</Badge>
</div>

// Custom стилове
<Badge className="bg-blue-500 hover:bg-blue-600">
  Premium
</Badge>
```

---

### Skeleton

Loading placeholder за съдържание.

```jsx
import { Skeleton } from "@/components/ui/skeleton"

// Основна употреба
<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
</div>

// Card skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-6 w-[150px]" />
    <Skeleton className="h-4 w-[250px]" />
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </CardContent>
</Card>

// Avatar skeleton
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

---

## 🔧 Common Компоненти

### PageLoader

Централизиран loading indicator за цяла страница.

```jsx
import { PageLoader } from "@/components/common/PageLoader"

// Употреба
function MyPage() {
  const { data, isLoading } = useData()
  
  if (isLoading) return <PageLoader />
  
  return <div>{/* Page content */}</div>
}
```

---

### LoadingSkeleton

Предварително дефинирани skeleton варианти.

```jsx
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton"

// Card skeleton
<LoadingSkeleton variant="card" />

// List skeleton
<LoadingSkeleton variant="list" count={5} />

// Text skeleton
<LoadingSkeleton variant="text" lines={3} />

// Custom skeleton
<LoadingSkeleton className="h-20 w-full" />
```

**Props:**
- `variant`: "card" | "list" | "text" | "table"
- `count`: number - брой елементи (за list)
- `lines`: number - брой редове (за text)
- `className`: string

---

### CenteredSpinner

Центриран loading spinner.

```jsx
import { CenteredSpinner } from "@/components/common/CenteredSpinner"

// Основна употреба
<CenteredSpinner />

// С custom размер
<CenteredSpinner size="lg" />

// С текст
<CenteredSpinner text="Loading workouts..." />
```

---

## 🚀 Feature Компоненти

### Dashboard Components

#### BasicUserStats

Показва основна статистика на потребителя.

```jsx
import { BasicUserStats } from "@/components/features/dashboard/components"

// Употреба
<BasicUserStats />

// Компонентът автоматично зарежда:
// - BMI калкулация
// - Текущо тегло
// - Целево тегло
// - Фитнес ниво
```

#### QuickActions

Grid с бързи действия за навигация.

```jsx
import { QuickActions } from "@/components/features/dashboard/components"

// Употреба
<QuickActions />

// Показва 8 бързи действия:
// - Start Workout
// - Log Meal
// - Track Weight
// - View Progress
// - etc.
```

#### ProgressCharts

Визуализация на прогреса с графики.

```jsx
import { ProgressCharts } from "@/components/features/dashboard/components"

// Употреба
<ProgressCharts 
  timeRange="month"
  metrics={["weight", "body_fat"]}
/>
```

---

### Workout Components

#### WorkoutBuilder

AI-powered workout builder компонент.

```jsx
import { WorkoutBuilder } from "@/components/features/workout/components"

// Употреба
<WorkoutBuilder 
  onComplete={(workout) => {
    console.log("Generated workout:", workout)
  }}
/>

// Компонентът включва:
// - 5-step assessment
// - AI генериране
// - Editing interface
// - Save functionality
```

#### WorkoutDetail

Детайлен изглед на тренировка.

```jsx
import { WorkoutDetail } from "@/components/features/workout/components"

// Употреба
<WorkoutDetail workoutId={workoutId} />

// Features:
// - Exercise list с видеа
// - Form cues
// - Set tracking
// - Progress indicators
```

#### MyWorkouts

Списък с потребителски тренировки.

```jsx
import { MyWorkouts } from "@/components/features/workout/components"

// Употреба
<MyWorkouts 
  view="grid" // или "list"
  filters={{
    status: "completed",
    dateRange: "week"
  }}
/>
```

---

### Auth Components

#### LoginForm

Форма за вход в системата.

```jsx
import { LoginForm } from "@/components/features/auth/forms"

// Употреба
<LoginForm 
  onSuccess={() => router.push("/dashboard")}
  redirectTo="/dashboard"
/>

// Features:
// - Email/password валидация
// - Remember me опция
// - Forgot password link
// - Loading states
// - Error handling
```

#### RegisterForm

Форма за регистрация.

```jsx
import { RegisterForm } from "@/components/features/auth/forms"

// Употреба
<RegisterForm 
  onSuccess={() => router.push("/auth/verify-email")}
/>

// Features:
// - Пълна валидация
// - Password strength indicator
// - Terms acceptance
// - Auto-login след регистрация
```

---

## 📐 Layout Компоненти

### AuthenticatedLayout

Layout за защитени страници.

```jsx
import { AuthenticatedLayout } from "@/components/common/layout"

// Употреба
<AuthenticatedLayout>
  <YourPageContent />
</AuthenticatedLayout>

// Features:
// - Sidebar navigation
// - User menu
// - Breadcrumbs
// - Mobile responsive
```

### AppSidebar

Основна навигация на приложението.

```jsx
import { AppSidebar } from "@/components/common/navigation/sidebar"

// Автоматично се използва в AuthenticatedLayout
// Може да се настройва през:
const sidebarConfig = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconHome,
      isActive: true
    }
  ]
}
```

---

## 🛠️ Utility Компоненти

### ThemeProvider

Контекст за управление на темата.

```jsx
import { ThemeProvider } from "@/components/common/theme/theme-provider"

// В root layout
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  <App />
</ThemeProvider>
```

### ModeToggle

Бутон за смяна на тема.

```jsx
import { ModeToggle } from "@/components/common/theme/mode-toggle"

// Употреба
<ModeToggle />

// Автоматично показва:
// - Light mode
// - Dark mode  
// - System
```

---

## 📝 Form Компоненти Best Practices

### Валидация Pattern

```jsx
// Използване на react-hook-form + zod
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  weight: z.number().min(1).max(500),
  reps: z.number().min(1).max(100),
})

function ExerciseSetForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 0,
      reps: 0,
    },
  })

  function onSubmit(values) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (kg)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  )
}
```

### Loading States Pattern

```jsx
function WorkoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(data) {
    setIsSubmitting(true)
    try {
      await createWorkout(data)
      toast.success("Workout created!")
    } catch (error) {
      toast.error("Failed to create workout")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
        {isSubmitting ? "Creating..." : "Create Workout"}
      </Button>
    </form>
  )
}
```

---

## 🎨 Styling Guidelines

### Tailwind Classes Organization

```jsx
// Препоръчителен ред на класове
<div
  className={cn(
    // Layout
    "flex items-center justify-between",
    // Spacing
    "p-4 mt-2 mb-4",
    // Sizing
    "w-full h-12",
    // Colors & Background
    "bg-white dark:bg-gray-800",
    // Borders
    "border border-gray-200 rounded-lg",
    // Effects
    "shadow-sm hover:shadow-md",
    // Transitions
    "transition-all duration-200",
    // Custom/conditional
    isActive && "ring-2 ring-primary"
  )}
>
```

### Responsive Design Pattern

```jsx
// Mobile-first подход
<Card className="
  w-full
  p-4
  md:p-6
  lg:p-8
  
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4
  md:gap-6
">
```

---

*Последна актуализация: Януари 2025*
*Версия: 1.0.0*