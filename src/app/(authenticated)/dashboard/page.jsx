import BasicUserStats from "@/components/features/dashboard/components/basic-user-stats";
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
  AlertCircle 
} from "lucide-react";

export default function DashboardPage() {
  // Mock data - in real app this would come from your backend
  const recentWorkouts = [
    { name: "Upper Body Strength", date: "Today", duration: "45 min", completed: true },
    { name: "HIIT Cardio", date: "Yesterday", duration: "30 min", completed: true },
    { name: "Lower Body Power", date: "2 days ago", duration: "50 min", completed: true },
  ];

  const upcomingWorkouts = [
    { name: "Rest Day", date: "Tomorrow", type: "recovery" },
    { name: "Full Body Circuit", date: "Thu, Dec 26", type: "strength" },
    { name: "Cardio & Core", date: "Fri, Dec 27", type: "cardio" },
  ];

  const weeklyGoals = {
    workouts: { current: 3, target: 4, label: "Workouts" },
    calories: { current: 1250, target: 2000, label: "Calories Burned" },
    water: { current: 6, target: 8, label: "Glasses of Water" },
  };

  return (
    <div className="space-y-6">
      {/* Top Grid - User Stats and Quick Actions */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <BasicUserStats 
          kilograms={82} 
          height={178} 
          age={25}
          goal="Weight Loss"
          targetWeight={80}
          workoutsThisWeek={3}
          targetWorkouts={4}
          caloriesBurned={1250}
          currentStreak={5}
        />
        
        <PlannerBuilder
          image="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=600&h=400&fit=crop&crop=center&auto=format&cs=tinysrgb"
          plannerTitle="AI Workout Builder"
          plannerDescription="Create personalized workout plans tailored to your goals and fitness level"
          href="/workout-builder"
          badge="AI-Powered"
          features={["Custom Plans", "Progress Tracking", "Exercise Library"]}
        />
        
        <PlannerBuilder
          image="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop&crop=center&auto=format&cs=tinysrgb"
          plannerTitle="Nutrition Planner"
          plannerDescription="Design custom meal plans and track your nutrition goals"
          href="/diet-builder"
          badge="New"
          features={["Meal Planning", "Calorie Tracking", "Recipe Library"]}
        />
      </div>

      {/* Weekly Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Goals Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(weeklyGoals).map(([key, goal]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{goal.label}</span>
                  <span className="font-medium">{goal.current}/{goal.target}</span>
                </div>
                <Progress 
                  value={(goal.current / goal.target) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Upcoming */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentWorkouts.map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">{workout.name}</p>
                    <p className="text-xs text-muted-foreground">{workout.date} • {workout.duration}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">Completed</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" size="sm">
              View All Workouts
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingWorkouts.map((workout, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{workout.name}</p>
                    <p className="text-xs text-muted-foreground">{workout.date}</p>
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

      {/* Quick Actions Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-center space-y-2">
            <Activity className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-medium">Start Workout</h3>
            <p className="text-xs text-muted-foreground">Begin your planned session</p>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-center space-y-2">
            <TrendingUp className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-medium">Log Progress</h3>
            <p className="text-xs text-muted-foreground">Update your metrics</p>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-center space-y-2">
            <Target className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-medium">Set Goals</h3>
            <p className="text-xs text-muted-foreground">Define new targets</p>
          </div>
        </Card>
        
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-center space-y-2">
            <Calendar className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-medium">Plan Week</h3>
            <p className="text-xs text-muted-foreground">Schedule workouts</p>
          </div>
        </Card>
      </div>
    </div>
  );
}