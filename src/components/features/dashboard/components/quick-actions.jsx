"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Plus, 
  Play, 
  Calendar,
  Zap,
  Brain
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkoutStore } from '@/stores/workout/useWorkoutStore';

export default function QuickActions() {
  const router = useRouter();
  const { workouts } = useWorkoutStore();
  
  // Find most recent planned workout
  const nextWorkout = workouts?.find(w => w.status === 'planned') || null;
  
  // Count pending workouts
  const pendingWorkouts = workouts?.filter(w => w.status === 'planned')?.length || 0;

  const actions = [
    {
      title: "Workout Builder",
      description: "Create your next workout",
      icon: Brain,
      action: () => router.push('/workout-builder'),
      variant: "default",
      featured: true
    },
    {
      title: "My Workouts",
      description: "View and manage workouts",
      icon: Play,
      action: () => router.push('/my-workouts'),
      variant: "secondary"
    },
    {
      title: "Track Progress",
      description: "Log your measurements",
      icon: Calendar,
      action: () => router.push('/progress'),
      variant: "outline"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
          {pendingWorkouts > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {pendingWorkouts} planned
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Next Workout Alert */}
        {nextWorkout && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{nextWorkout.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(nextWorkout.workout_date).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Planned
              </Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant={action.variant}
                onClick={action.action}
                className={`justify-start h-auto p-3 ${action.featured ? 'border-primary/50' : ''}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-lg ${
                    action.featured 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Add Workout Button */}
        <Button 
          variant="ghost" 
          className="w-full gap-2 h-8 text-xs"
          onClick={() => router.push('/workout-builder')}
        >
          <Plus className="h-3 w-3" />
          Add Workout
        </Button>
      </CardContent>
    </Card>
  );
} 