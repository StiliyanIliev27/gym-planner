"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProgressCharts() {
  // Mock data for weight tracking (last 7 days)
  const weightData = [
    { day: "Mon", weight: 84.2 },
    { day: "Tue", weight: 83.8 },
    { day: "Wed", weight: 83.5 },
    { day: "Thu", weight: 83.2 },
    { day: "Fri", weight: 82.8 },
    { day: "Sat", weight: 82.5 },
    { day: "Sun", weight: 82.0 },
  ];

  // Mock data for workout frequency (last 4 weeks)
  const workoutData = [
    { week: "W1", workouts: 3 },
    { week: "W2", workouts: 4 },
    { week: "W3", workouts: 3 },
    { week: "W4", workouts: 5 },
  ];

  const weightChange = weightData[weightData.length - 1].weight - weightData[0].weight;
  const avgWorkouts = workoutData.reduce((sum, w) => sum + w.workouts, 0) / workoutData.length;

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const maxWeight = Math.max(...weightData.map(d => d.weight));
  const minWeight = Math.min(...weightData.map(d => d.weight));
  const weightRange = maxWeight - minWeight;

  const maxWorkouts = Math.max(...workoutData.map(d => d.workouts));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Weight Progress Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Weight Progress</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(weightChange)}
              <span className={`text-sm font-medium ${
                weightChange < 0 ? 'text-green-600' : weightChange > 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {Math.abs(weightChange).toFixed(1)} kg
              </span>
            </div>
          </CardTitle>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Simple bar chart representation */}
            <div className="flex items-end gap-1 h-24">
              {weightData.map((data, index) => {
                const height = weightRange > 0 
                  ? ((data.weight - minWeight) / weightRange) * 80 + 10
                  : 45;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary rounded-t-sm transition-all hover:bg-primary/80"
                      style={{ height: `${height}px` }}
                      title={`${data.day}: ${data.weight} kg`}
                    />
                    <span className="text-xs text-muted-foreground mt-1">{data.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Target: 80 kg</span>
              <span>Current: {weightData[weightData.length - 1].weight} kg</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Frequency Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Workout Frequency</span>
            <Badge variant="outline" className="text-xs">
              Avg {avgWorkouts.toFixed(1)}/week
            </Badge>
          </CardTitle>
          <p className="text-xs text-muted-foreground">Last 4 weeks</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* Simple bar chart for workouts */}
            <div className="flex items-end gap-2 h-24">
              {workoutData.map((data, index) => {
                const height = (data.workouts / maxWorkouts) * 80;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-400"
                      style={{ height: `${height}px` }}
                      title={`${data.week}: ${data.workouts} workouts`}
                    />
                    <span className="text-xs text-muted-foreground mt-1">{data.week}</span>
                  </div>
                );
              })}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Goal: 4 workouts/week</span>
                <span className="font-medium">This week: 5</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (5/4) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 