"use client";

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Plus, 
  TrendingUp,
  Calendar,
  Activity,
  Apple,
  BarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useWorkoutStore } from '@/stores/workout/useWorkoutStore';

// Import dashboard components
import BasicUserStats from '@/components/features/dashboard/components/basic-user-stats';
import QuickActions from '@/components/features/dashboard/components/quick-actions';
import ActivityFeed from '@/components/features/dashboard/components/activity-feed';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const { workouts, loadUserWorkouts } = useWorkoutStore();

  useEffect(() => {
    if (user?.id) {
      loadUserWorkouts(user.id, 30);
    }
  }, [user?.id, loadUserWorkouts]);

  // Get next planned workout
  const nextWorkout = workouts?.find(w => w.status === 'planned');
  const completedToday = workouts?.filter(w => {
    const today = new Date().toISOString().split('T')[0];
    return w.workout_date === today && w.status === 'completed';
  }).length || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.first_name || 'there';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 17) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  const getStatusMessage = () => {
    if (completedToday > 0) {
      return `You've completed ${completedToday} workout${completedToday > 1 ? 's' : ''} today. Great work!`;
    }
    if (nextWorkout) {
      return `You have "${nextWorkout.name}" planned. Ready to get started?`;
    }
    return "What would you like to focus on today?";
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{getGreeting()}</h1>
          <p className="text-muted-foreground">
            {getStatusMessage()}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => router.push('/workout-builder')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Workout
          </Button>
        </div>
      </div>

      {/* Next Workout Card - Only show if there's one planned */}
      {nextWorkout && (
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{nextWorkout.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Scheduled for {new Date(nextWorkout.workout_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button 
                size="sm"
                onClick={() => router.push(`/workout-detail/${nextWorkout.id}`)}
                className="gap-2"
              >
                <Activity className="h-3 w-3" />
                Start Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Access Section - Fitness & Nutrition */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Fitness Section */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Dumbbell className="h-5 w-5" />
              Fitness Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => router.push('/my-workouts')}
              >
                <Dumbbell className="h-5 w-5" />
                <span className="text-sm">My Workouts</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => router.push('/workout-builder')}
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm">New Plan</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Nutrition Section */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Apple className="h-5 w-5" />
              Nutrition Plans
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => router.push('/diet-builder')}
                disabled
              >
                <Apple className="h-5 w-5" />
                <span className="text-sm">Diet Builder</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-1"
                onClick={() => router.push('/nutrition')}
                disabled
              >
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Meal Plans</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Coming soon - Track meals and nutrition goals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Left Column - Primary Content */}
        <div className="lg:col-span-2 h-full">
          {/* User Stats */}
          <BasicUserStats />
        </div>

        {/* Right Column - Secondary Content */}
        <div className="space-y-6 h-full">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Recent Activity */}
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}