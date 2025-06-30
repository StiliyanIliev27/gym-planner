import BasicUserStats from "@/components/features/dashboard/components/basic-user-stats";
import ProgressCharts from "@/components/features/dashboard/components/progress-charts";
import SmartInsights from "@/components/features/dashboard/components/smart-insights";
import QuickActions from "@/components/features/dashboard/components/quick-actions";
import PlannerBuilder from "@/components/common/layout/planner-builder-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  TrendingUp, 
  Activity, 
  Target, 
  Clock,
  CheckCircle,
  AlertCircle,
  Flame,
  Droplets,
  Moon,
  Heart
} from "lucide-react";

export default function DashboardPage() {
  // Mock data - in real app this would come from your backend/API
  const recentWorkouts = [
    { 
      name: "Upper Body Strength", 
      date: "Today", 
      duration: "45 min", 
      completed: true,
      calories: 320,
      exercises: 8
    },
    { 
      name: "HIIT Cardio", 
      date: "Yesterday", 
      duration: "30 min", 
      completed: true,
      calories: 280,
      exercises: 6
    },
    { 
      name: "Lower Body Power", 
      date: "2 days ago", 
      duration: "50 min", 
      completed: true,
      calories: 380,
      exercises: 10
    },
  ];

  const upcomingWorkouts = [
    { 
      name: "Active Recovery", 
      date: "Tomorrow", 
      time: "6:00 PM",
      type: "recovery",
      duration: "30 min"
    },
    { 
      name: "Full Body Circuit", 
      date: "Thu, Dec 26", 
      time: "7:00 AM",
      type: "strength",
      duration: "45 min"
    },
    { 
      name: "Cardio & Core", 
      date: "Fri, Dec 27", 
      time: "6:30 PM",
      type: "cardio",
      duration: "40 min"
    },
  ];

  const weeklyGoals = {
    workouts: { current: 4, target: 4, label: "Workouts", unit: "" },
    calories: { current: 1250, target: 2000, label: "Calories Burned", unit: "kcal" },
    water: { current: 6, target: 8, label: "Water Intake", unit: "glasses" },
    sleep: { current: 7.2, target: 8, label: "Average Sleep", unit: "hours" },
  };

  // Calculate today's summary
  const todaySummary = {
    workoutCompleted: true,
    caloriesBurned: 320,
    waterIntake: 6,
    sleepLastNight: 7.5,
    stepsToday: 8200
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Today's Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              Today's Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-sm font-medium">Workout</p>
                <p className="text-xs text-muted-foreground">
                  {todaySummary.workoutCompleted ? "Completed" : "Pending"}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-sm font-medium">{todaySummary.caloriesBurned}</p>
                <p className="text-xs text-muted-foreground">Calories burned</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-medium">{todaySummary.waterIntake}/8</p>
                <p className="text-xs text-muted-foreground">Glasses of water</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Moon className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-sm font-medium">{todaySummary.sleepLastNight}h</p>
                <p className="text-xs text-muted-foreground">Sleep last night</p>
              </div>
              <div className="text-center p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600 mx-auto mb-1" />
                <p className="text-sm font-medium">{todaySummary.stepsToday.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Steps today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - User Stats and Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Stats and Builder Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <BasicUserStats 
              kilograms={82} 
              height={178} 
              age={25}
              goal="Weight Loss"
              targetWeight={80}
              workoutsThisWeek={4}
              targetWorkouts={4}
              caloriesBurned={1250}
              currentStreak={5}
            />
            
            <PlannerBuilder
              image="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop&crop=center&auto=format&cs=tinysrgb"
              plannerTitle="AI Workout Builder"
              plannerDescription="Create personalized workout plans tailored to your goals"
              href="/workout-builder"
              badge="AI-Powered"
              features={["Custom Plans", "Progress Tracking", "Exercise Library"]}
            />
            
            <PlannerBuilder
              image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&crop=center&auto=format&cs=tinysrgb"
              plannerTitle="Nutrition Planner"
              plannerDescription="Design custom meal plans and track nutrition goals"
              href="/diet-builder"
              badge="Coming Soon"
              features={["Meal Planning", "Calorie Tracking", "Recipe Library"]}
            />
          </div>

          {/* Progress Charts */}
          <ProgressCharts />

          {/* Weekly Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Weekly Goals Progress
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Track your weekly targets and maintain consistency
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(weeklyGoals).map(([key, goal]) => {
                  const progressPercent = (goal.current / goal.target) * 100;
                  const isCompleted = progressPercent >= 100;
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {goal.label}
                          {isCompleted && <CheckCircle className="h-3 w-3 text-green-600" />}
                        </span>
                        <span className="font-medium">
                          {goal.current}{goal.unit ? ` ${goal.unit}` : ''} / {goal.target}{goal.unit ? ` ${goal.unit}` : ''}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(progressPercent, 100)}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {isCompleted ? "Goal achieved! 🎉" : `${(100 - progressPercent).toFixed(0)}% remaining`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Insights and Quick Actions */}
        <div className="space-y-6">
          <SmartInsights />
          
          {/* Recent & Upcoming Workouts */}
          <div className="space-y-4">
            {/* Recent Workouts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5" />
                  Recent Workouts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">{workout.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {workout.date} • {workout.duration} • {workout.calories} cal
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {workout.exercises} exercises
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" size="sm">
                  View All Workouts
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Upcoming Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{workout.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {workout.date} • {workout.time} • {workout.duration}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={workout.type === 'recovery' ? 'secondary' : 'default'} 
                      className="text-xs"
                    >
                      {workout.type}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" size="sm">
                  Manage Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Section - Quick Actions */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            Fast access to your most used features
          </p>
        </div>
        <QuickActions />
      </div>
    </div>
  );
}