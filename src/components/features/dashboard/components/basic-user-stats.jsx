import { Dumbbell, Ruler, Weight, Target, TrendingUp, Calendar, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export default function BasicUserStats({
  kilograms = 82,
  height = 178,
  age = 25,
  goal = "General Fitness",
  targetWeight = 80,
  workoutsThisWeek = 3,
  targetWorkouts = 4,
  caloriesBurned = 1250,
  currentStreak = 5,
}) {
  const weightProgress = Math.max(0, Math.min(100, ((kilograms - targetWeight) / kilograms) * 100));
  const workoutProgress = (workoutsThisWeek / targetWorkouts) * 100;
  const bmi = (kilograms / ((height / 100) ** 2)).toFixed(1);
  
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-blue-600" };
    if (bmi < 25) return { text: "Normal", color: "text-green-600" };
    if (bmi < 30) return { text: "Overweight", color: "text-yellow-600" };
    return { text: "Obese", color: "text-red-600" };
  };

  const bmiStatus = getBMIStatus(bmi);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
          </div>
          Your Fitness Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <Weight className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-semibold">{kilograms} kg</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <Ruler className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Height</p>
              <p className="font-semibold">{height} cm</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <span className="text-primary text-lg">🎂</span>
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold">{age} yrs</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">BMI</p>
              <p className={`font-semibold ${bmiStatus.color}`}>{bmi}</p>
            </div>
          </div>
        </div>

        {/* Goal & Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Current Goal</p>
            <Badge variant="secondary" className="text-xs">{goal}</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Weekly Workouts</span>
              <span>{workoutsThisWeek}/{targetWorkouts}</span>
            </div>
            <Progress value={workoutProgress} className="h-2" />
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Flame className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className="text-green-600 font-semibold">{caloriesBurned}</p>
            <p className="text-muted-foreground">Calories Burned</p>
          </div>
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <Calendar className="h-4 w-4 text-orange-600 mx-auto mb-1" />
            <p className="text-orange-600 font-semibold">{currentStreak}</p>
            <p className="text-muted-foreground">Day Streak</p>
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full mt-4" variant="outline">
          <BarChart3 className="h-4 w-4 mr-2" />
          View Detailed Progress
        </Button>
      </CardContent>
    </Card>
  );
}
