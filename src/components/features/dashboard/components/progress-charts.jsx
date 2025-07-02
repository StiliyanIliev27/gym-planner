"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Target,
  Activity,
  Clock
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useWorkoutStore } from '@/stores/workout/useWorkoutStore';

/**
 * Progress Charts Component with real data integration
 * Shows weight progress and workout frequency charts
 */
export default function ProgressCharts() {
  const { user } = useAuthStore();
  const { workouts, loadUserWorkouts } = useWorkoutStore();
  const [progressData, setProgressData] = useState({
    weeklyProgress: 0,
    monthlyGoal: 0,
    totalWorkouts: 0,
    averageDuration: 0,
    thisWeekWorkouts: 0,
    consistency: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadUserWorkouts(user.id, 30);
    }
  }, [user?.id, loadUserWorkouts]);

  useEffect(() => {
    if (workouts) {
      calculateProgress();
    }
  }, [workouts]);

  const calculateProgress = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // This week's workouts
    const thisWeekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.workout_date);
      return workoutDate >= weekAgo && w.status === 'completed';
    }).length;

    // This month's workouts
    const thisMonthWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.workout_date);
      return workoutDate >= monthAgo && w.status === 'completed';
    }).length;

    // Average workout duration
    const completedWorkouts = workouts.filter(w => w.status === 'completed');
    const totalDuration = completedWorkouts.reduce((sum, w) => sum + (w.total_duration_minutes || 0), 0);
    const averageDuration = completedWorkouts.length > 0 ? Math.round(totalDuration / completedWorkouts.length) : 0;

    // Weekly target (assuming 4 workouts per week)
    const weeklyTarget = 4;
    const weeklyProgress = Math.min(100, (thisWeekWorkouts / weeklyTarget) * 100);

    // Monthly target (assuming 16 workouts per month)
    const monthlyTarget = 16;
    const monthlyGoal = Math.min(100, (thisMonthWorkouts / monthlyTarget) * 100);

    // Consistency (days with workouts in last 30 days)
    const workoutDays = new Set(
      completedWorkouts.map(w => w.workout_date.split('T')[0])
    ).size;
    const consistency = Math.min(100, (workoutDays / 30) * 100);

    setProgressData({
      weeklyProgress,
      monthlyGoal,
      totalWorkouts: completedWorkouts.length,
      averageDuration,
      thisWeekWorkouts,
      consistency
    });
  };

  const progressItems = [
    {
      title: "Weekly Goal",
      value: progressData.weeklyProgress,
      current: progressData.thisWeekWorkouts,
      target: 4,
      unit: "workouts",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "Monthly Progress",
      value: progressData.monthlyGoal,
      current: Math.round(progressData.monthlyGoal * 16 / 100),
      target: 16,
      unit: "workouts",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Consistency",
      value: progressData.consistency,
      current: Math.round(progressData.consistency * 30 / 100),
      target: 30,
      unit: "active days",
      icon: Activity,
      color: "text-purple-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Progress Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-2xl font-bold">{progressData.totalWorkouts}</div>
            <div className="text-xs text-muted-foreground">Total Workouts</div>
          </div>
          <div className="text-center p-3 bg-accent/20 rounded-lg">
            <div className="text-2xl font-bold">{progressData.averageDuration}</div>
            <div className="text-xs text-muted-foreground">Avg Duration (min)</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {progressItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.current}/{item.target} {item.unit}
                  </div>
                </div>
                <div className="space-y-1">
                  <Progress value={item.value} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(item.value)}% complete</span>
                    {item.value >= 100 && (
                      <Badge variant="default" className="text-xs">
                        Goal Achieved
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivation Message */}
        {progressData.weeklyProgress < 25 && progressData.thisWeekWorkouts === 0 && (
          <div className="p-3 bg-muted/50 rounded-lg border">
            <p className="text-sm text-muted-foreground">
              Ready to start your week? Your first workout is just a click away.
            </p>
          </div>
        )}

        {progressData.weeklyProgress >= 25 && progressData.weeklyProgress < 75 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Nice progress this week! You're on track to reach your goal.
            </p>
          </div>
        )}

        {progressData.weeklyProgress >= 100 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-700 dark:text-green-300">
              Week completed! You've hit your workout target.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 