"use client";

import { useEffect, useState } from "react";
import { Dumbbell, Ruler, Weight, Target, TrendingUp, Calendar, Flame, Clock, Activity, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useProgressStore } from "@/stores/progress/useProgressStore";
import { useWorkoutStore } from "@/stores/workout/useWorkoutStore";
import { getWorkoutStats } from "@/lib/services/workoutService";

/**
 * Basic User Stats Component with real data integration
 * Displays user's fitness profile, goals, and current progress
 */
export default function BasicUserStats() {
  const router = useRouter();
  const { 
    user, 
    profile, 
    goals, 
    profileLoading,
    getCurrentGoal,
    hasCompletedProfile 
  } = useAuthStore();
  
  const { 
    latestMeasurements, 
    loadLatestMeasurements,
    measurementsLoading,
    getCurrentWeight
  } = useProgressStore();
  
  const { 
    workoutStats,
    loadWorkoutStats, 
    statsLoading,
    getCompletedWorkoutsCount,
    workouts
  } = useWorkoutStore();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data when user is available
  useEffect(() => {
    if (user?.id) {
      loadLatestMeasurements(user.id);
      loadWorkoutStats(user.id, 7); // Last 7 days
    }
  }, [user?.id, loadLatestMeasurements, loadWorkoutStats]);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const { data } = await getWorkoutStats(user.id, 30);
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.id]);

  // Loading state
  if (profileLoading || measurementsLoading || statsLoading || loading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-48">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your fitness profile...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate user stats from real data
  const currentWeight = getCurrentWeight() || profile?.weight_kg || latestMeasurements?.weight_kg || 70;
  const height = profile?.height_cm || latestMeasurements?.height_cm || 170;
  const age = profile?.date_of_birth 
    ? Math.floor((new Date() - new Date(profile.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;
  
  // Get current goals
  const weightGoal = getCurrentGoal('weight_loss') || getCurrentGoal('muscle_gain');
  const workoutGoal = getCurrentGoal('workout_frequency');
  
  const targetWeight = weightGoal?.target_weight_kg || currentWeight;
  const targetWorkouts = workoutGoal?.weekly_workout_frequency || 4;
  
  // Workout stats from real data
  const workoutsThisWeek = workoutStats?.workouts_completed || 0;
  const caloriesBurned = workoutStats?.total_calories_burned || 0;
  const currentStreak = workoutStats?.current_streak || 0;

  // Calculations
  const weightProgress = targetWeight !== currentWeight 
    ? Math.max(0, Math.min(100, Math.abs((currentWeight - targetWeight) / currentWeight) * 100))
    : 100;
  const workoutProgress = (workoutsThisWeek / targetWorkouts) * 100;
  const bmi = height > 0 ? (currentWeight / ((height / 100) ** 2)).toFixed(1) : 0;
  
  const getBMIStatus = (bmi) => {
    const bmiNum = parseFloat(bmi);
    if (bmiNum < 18.5) return { text: "Underweight", color: "text-blue-600" };
    if (bmiNum < 25) return { text: "Normal", color: "text-green-600" };
    if (bmiNum < 30) return { text: "Overweight", color: "text-yellow-600" };
    return { text: "Obese", color: "text-red-600" };
  };

  const bmiStatus = getBMIStatus(bmi);
  
  // Determine goal type for display
  const primaryGoal = profile?.fitness_goals || 
    (weightGoal?.goal_type === 'weight_loss' ? 'Weight Loss' : 
     weightGoal?.goal_type === 'muscle_gain' ? 'Muscle Gain' : 'General Fitness');

  // Calculate this week's workouts
  const thisWeek = workouts?.filter(w => {
    const workoutDate = new Date(w.workout_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  })?.length || 0;

  // Get most trained muscle group
  const topMuscleGroup = stats?.muscleGroupsWorked ? 
    Object.entries(stats.muscleGroupsWorked)
      .sort(([,a], [,b]) => b - a)[0]?.[0] : null;

  // Get most used workout tag
  const topWorkoutTag = stats?.workoutsByTags ? 
    Object.entries(stats.workoutsByTags)
      .sort(([,a], [,b]) => b - a)[0]?.[0] : null;

  const statsCards = [
    {
      title: "This Week",
      value: thisWeek,
      unit: thisWeek === 1 ? "workout" : "workouts",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "This Month",
      value: stats?.workoutsThisMonth || 0,
      unit: "completed",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Total Hours",
      value: Math.round((stats?.totalDuration || 0) / 60),
      unit: "trained",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Avg Session",
      value: stats?.averageDuration || 0,
      unit: "minutes",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-5 w-5 text-primary" />
          </div>
          Your Fitness Profile
          {!hasCompletedProfile() && (
            <Badge variant="outline" className="text-xs">
              Incomplete
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-6 flex-1">
        {/* Profile Completion Notice */}
        {!hasCompletedProfile() && (
          <div 
            className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border-l-4 border-yellow-500 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            onClick={() => router.push('/profile')}
          >
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Complete your profile to see personalized stats and recommendations. 
              <span className="font-medium underline ml-1">Click here</span>
            </p>
          </div>
        )}

        {/* Basic Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <Weight className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-semibold">
                {currentWeight ? `${currentWeight} kg` : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <Ruler className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Height</p>
              <p className="font-semibold">
                {height ? `${height} cm` : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold">
                {age ? `${age} yrs` : 'Not set'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">BMI</p>
              <p className={`font-semibold ${bmi > 0 ? bmiStatus.color : 'text-muted-foreground'}`}>
                {bmi > 0 ? bmi : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Goal & Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Current Goal</p>
            <Badge variant="secondary" className="text-xs">{primaryGoal}</Badge>
          </div>
          
          {workoutGoal && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Weekly Workouts</span>
                <span>{workoutsThisWeek}/{targetWorkouts}</span>
              </div>
              <Progress value={workoutProgress} className="h-2" />
              {workoutProgress >= 100 && (
                <p className="text-xs text-green-600 font-medium">Weekly goal completed!</p>
              )}
            </div>
          )}
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <Flame className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className="text-green-600 font-semibold">
              {caloriesBurned > 0 ? caloriesBurned.toLocaleString() : '0'}
            </p>
            <p className="text-muted-foreground">Calories Burned</p>
          </div>
          <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <Calendar className="h-4 w-4 text-orange-600 mx-auto mb-1" />
            <p className="text-orange-600 font-semibold">{currentStreak}</p>
            <p className="text-muted-foreground">Day Streak</p>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => router.push(hasCompletedProfile() ? '/progress' : '/profile')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          {hasCompletedProfile() ? 'View Detailed Progress' : 'Complete Profile'}
        </Button>

        {/* Fitness Level Assessment */}
        {hasCompletedProfile() && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Fitness Assessment</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {/* Activity Level */}
              <div className="flex items-center justify-between p-2 bg-accent/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-primary" />
                  <span>Activity Level</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {thisWeek >= 4 ? 'Very Active' : 
                   thisWeek >= 2 ? 'Active' : 
                   thisWeek >= 1 ? 'Moderate' : 'Low'}
                </Badge>
              </div>

              {/* Consistency */}
              <div className="flex items-center justify-between p-2 bg-accent/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary" />
                  <span>Consistency</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {currentStreak >= 7 ? 'Excellent' : 
                   currentStreak >= 3 ? 'Good' : 
                   currentStreak >= 1 ? 'Fair' : 'Building'}
                </Badge>
              </div>

              {/* BMI Health Status */}
              {bmi > 0 && (
                <div className="flex items-center justify-between p-2 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    <span>Health Range</span>
                  </div>
                  <Badge 
                    variant={bmiStatus.text === 'Normal' ? 'default' : 'outline'} 
                    className="text-xs"
                  >
                    {bmiStatus.text}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Achievements & Milestones */}
        {(currentStreak >= 7 || stats?.totalWorkouts >= 10 || (stats?.totalDuration || 0) >= 300) && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Recent Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {currentStreak >= 7 && (
                <Badge variant="default" className="gap-1 text-xs">
                  <Trophy className="h-3 w-3" />
                  {currentStreak} Day Streak
                </Badge>
              )}
              {stats?.totalWorkouts >= 10 && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Dumbbell className="h-3 w-3" />
                  {stats.totalWorkouts >= 50 ? 'Fitness Pro' : 
                   stats.totalWorkouts >= 25 ? 'Regular' : 'Getting Started'}
                </Badge>
              )}
              {(stats?.totalDuration || 0) >= 300 && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {Math.round((stats.totalDuration || 0) / 60)}h Trained
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Monthly Summary */}
        {stats?.workoutsThisMonth > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">This Month Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Calendar className="h-3 w-3 text-blue-600 mx-auto mb-1" />
                <p className="text-blue-600 font-semibold">{stats.workoutsThisMonth}</p>
                <p className="text-muted-foreground">Workouts</p>
              </div>
              <div className="text-center p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Clock className="h-3 w-3 text-purple-600 mx-auto mb-1" />
                <p className="text-purple-600 font-semibold">
                  {Math.round(((stats.totalDuration || 0) * (stats.workoutsThisMonth || 0) / Math.max(stats.totalWorkouts || 1, 1)) / 60)}h
                </p>
                <p className="text-muted-foreground">This Month</p>
              </div>
            </div>
          </div>
        )}

        {/* Body Composition Insights */}
        {hasCompletedProfile() && bmi > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Health Insights</h4>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">BMI: {bmi}</span>
                <Badge variant="outline" className="text-xs">{bmiStatus.text}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {bmiStatus.text === 'Normal' 
                  ? 'Great! You\'re in a healthy weight range. Keep maintaining your fitness routine.'
                  : bmiStatus.text === 'Underweight'
                  ? 'Consider muscle-building exercises and proper nutrition to reach a healthy weight.'
                  : 'Focus on cardio and strength training to reach your optimal weight range.'
                }
              </p>
            </div>
          </div>
        )}

        {/* Quick insights */}
        {(topMuscleGroup || topWorkoutTag || (stats?.totalWorkouts > 0)) && (
          <div className="flex flex-wrap gap-2 pt-3 border-t">
            {topMuscleGroup && (
              <Badge variant="secondary" className="gap-1">
                <Dumbbell className="h-3 w-3" />
                Top: {topMuscleGroup}
              </Badge>
            )}
            {topWorkoutTag && (
              <Badge variant="outline" className="gap-1">
                <Target className="h-3 w-3" />
                {topWorkoutTag}
              </Badge>
            )}
            {stats?.totalWorkouts > 0 && (
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                {stats.totalWorkouts} total workouts
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
