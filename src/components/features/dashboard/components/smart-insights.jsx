"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Target,
  Clock,
  Zap,
  Loader2
} from "lucide-react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useProgressStore } from "@/stores/progress/useProgressStore";
import { useWorkoutStore } from "@/stores/workout/useWorkoutStore";

/**
 * Smart Insights Component with real data analysis
 * Generates personalized recommendations based on user activity and progress
 */
export default function SmartInsights() {
  const { user, profile, getCurrentGoal } = useAuthStore();
  const { 
    measurements, 
    loadUserMeasurements, 
    getWeightChange,
    measurementsLoading
  } = useProgressStore();
  const { 
    workouts, 
    workoutStats,
    loadUserWorkouts,
    loadWorkoutStats,
    workoutsLoading
  } = useWorkoutStore();

  // Load data when user is available
  useEffect(() => {
    if (user?.id) {
      loadUserMeasurements(user.id, 30);
      loadUserWorkouts(user.id, 14); // Last 2 weeks
      loadWorkoutStats(user.id, 7); // Last week
    }
  }, [user?.id, loadUserMeasurements, loadUserWorkouts, loadWorkoutStats]);

  // Generate insights based on real data
  const insights = useMemo(() => {
    if (!user || measurementsLoading || workoutsLoading) return [];

    const generatedInsights = [];
    
    // Workout frequency insights
    const workoutGoal = getCurrentGoal('workout_frequency');
    const targetWorkouts = workoutGoal?.weekly_workout_frequency || 4;
    const weeklyWorkouts = workoutStats?.workouts_completed || 0;
    
    if (weeklyWorkouts >= targetWorkouts) {
      generatedInsights.push({
        type: "success",
        icon: CheckCircle,
        title: "Weekly Goal Complete",
        description: `You've completed ${weeklyWorkouts}/${targetWorkouts} workouts this week. Great consistency!`,
        priority: "high",
        action: "Keep up the momentum"
      });
    } else if (weeklyWorkouts > 0) {
      const remaining = targetWorkouts - weeklyWorkouts;
      generatedInsights.push({
        type: "warning",
        icon: AlertTriangle,
        title: "Workout Goal Behind",
        description: `You need ${remaining} more workout${remaining > 1 ? 's' : ''} to reach your weekly goal.`,
        priority: "medium",
        action: "Schedule workouts"
      });
    }

    // Weight progress insights
    const weightChange = getWeightChange(7); // 7 day change
    const weightGoal = getCurrentGoal('weight_loss') || getCurrentGoal('muscle_gain');
    
    if (weightChange && weightGoal) {
      const goalType = weightGoal.goal_type;
      const changeRate = Math.abs(weightChange.change);
      
      if (goalType === 'weight_loss' && weightChange.change < 0) {
        if (changeRate >= 0.3 && changeRate <= 0.8) {
          generatedInsights.push({
            type: "success",
            icon: TrendingUp,
            title: "Optimal Weight Loss",
            description: `You've lost ${changeRate.toFixed(1)}kg this week - perfect pace!`,
            priority: "low",
            action: "Maintain current approach"
          });
        } else if (changeRate > 0.8) {
          generatedInsights.push({
            type: "warning",
            icon: AlertTriangle,
            title: "Weight Loss Too Fast",
            description: `You've lost ${changeRate.toFixed(1)}kg this week. Consider increasing calorie intake.`,
            priority: "medium",
            action: "Adjust nutrition plan"
          });
        }
      } else if (goalType === 'muscle_gain' && weightChange.change > 0) {
        if (changeRate >= 0.1 && changeRate <= 0.3) {
          generatedInsights.push({
            type: "success",
            icon: TrendingUp,
            title: "Healthy Weight Gain",
            description: `You've gained ${changeRate.toFixed(1)}kg this week - great for muscle building!`,
            priority: "low",
            action: "Continue current plan"
          });
        }
      }
    }

    // Recovery and rest insights
    const recentWorkouts = workouts?.filter(w => {
      const workoutDate = new Date(w.workout_date);
      const today = new Date();
      const diffDays = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && w.status === 'completed';
    }) || [];

    if (recentWorkouts.length >= 3) {
      generatedInsights.push({
        type: "tip",
        icon: Lightbulb,
        title: "Consider Rest Day",
        description: "You've worked out 3 days in a row. A rest day could boost your performance.",
        priority: "medium",
        action: "Plan active recovery"
      });
    }

    // Consistency insights
    const workoutStreak = workoutStats?.current_streak || 0;
    if (workoutStreak >= 7) {
      generatedInsights.push({
        type: "success",
        icon: CheckCircle,
        title: `${workoutStreak} Day Streak`,
        description: "Great consistency! You're building a strong fitness habit.",
        priority: "high",
        action: "Celebrate your progress"
      });
    }

    // Profile completion insights
    if (profile && !profile.height_cm) {
      generatedInsights.push({
        type: "tip",
        icon: Target,
        title: "Complete Your Profile",
        description: "Add your height and other details for more accurate insights.",
        priority: "medium",
        action: "Update profile"
      });
    }

    // Default insight if no specific ones generated
    if (generatedInsights.length === 0) {
      generatedInsights.push({
        type: "tip",
        icon: Lightbulb,
        title: "Start Your Journey",
        description: "Begin logging workouts and measurements to receive personalized insights.",
        priority: "medium",
        action: "Log first workout"
      });
    }

    return generatedInsights.slice(0, 3); // Limit to 3 insights
  }, [user, workoutStats, workouts, measurements, getCurrentGoal, getWeightChange, profile, measurementsLoading, workoutsLoading]);

  // Generate today's tip based on user data
  const todaysTip = useMemo(() => {
    if (!user || !profile) {
      return {
        title: "Today's Focus",
        tip: "Complete your profile to get personalized daily tips!",
        category: "Getting Started"
      };
    }

    const tips = [
      {
        title: "Today's Focus",
        tip: "Focus on form over weight - perfect technique builds long-term results.",
        category: "Strength Training"
      },
      {
        title: "Today's Focus", 
        tip: "Stay hydrated! Aim for 8-10 glasses of water throughout the day.",
        category: "Nutrition"
      },
      {
        title: "Today's Focus",
        tip: "Take 5 minutes for deep breathing between exercises for better recovery.",
        category: "Recovery"
      },
      {
        title: "Today's Focus",
        tip: "Track your progress photos - visual changes often come before the scale!",
        category: "Progress Tracking"
      }
    ];

    // Select tip based on day of week
    const dayIndex = new Date().getDay();
    return tips[dayIndex % tips.length];
  }, [user, profile]);

  const getIconColor = (type) => {
    switch (type) {
      case "success": return "text-green-600";
      case "tip": return "text-blue-600";
      case "warning": return "text-yellow-600";
      case "trend": return "text-purple-600";
      default: return "text-gray-600";
    }
  };

  const getBadgeVariant = (priority) => {
    switch (priority) {
      case "high": return "default";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  // Loading state
  if (measurementsLoading || workoutsLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading insights...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Today's Tip */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            {todaysTip.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">{todaysTip.tip}</p>
            <Badge variant="outline" className="text-xs">
              {todaysTip.category}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Smart Insights */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Lightbulb className="h-4 w-4 text-blue-600" />
            </div>
            Smart Insights
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Personalized recommendations based on your activity
          </p>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No insights available yet</p>
              <p className="text-xs">Start logging workouts to see recommendations</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon;
                return (
                  <div key={index} className="p-3 rounded-lg border bg-card hover:bg-accent/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-background rounded">
                        <IconComponent className={`h-4 w-4 ${getIconColor(insight.type)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-medium">{insight.title}</h4>
                          <Badge variant={getBadgeVariant(insight.priority)} className="text-xs">
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <Button variant="outline" className="w-full mt-3" size="sm">
            View All Insights
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 