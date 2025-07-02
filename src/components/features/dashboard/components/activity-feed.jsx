"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  Calendar,
  Target,
  Trophy
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth/useAuthStore';
import { useWorkoutStore } from '@/stores/workout/useWorkoutStore';

export default function ActivityFeed() {
  const { user } = useAuthStore();
  const { workouts, loadUserWorkouts } = useWorkoutStore();
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadUserWorkouts(user.id, 14); // Last 2 weeks
    }
  }, [user?.id, loadUserWorkouts]);

  useEffect(() => {
    if (workouts) {
      // Convert workouts to activity feed format
      const activities = workouts
        .filter(w => w.status === 'completed')
        .slice(0, 6)
        .map(workout => ({
          id: workout.id,
          type: 'workout_completed',
          title: workout.name,
          description: `${workout.workout_exercises?.length || 0} exercises`,
          timestamp: workout.workout_date,
          duration: workout.total_duration_minutes,
          tags: workout.workout_tags || [],
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20'
        }));
      
      setRecentActivities(activities);
    }
  }, [workouts]);

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (recentActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No recent activity</p>
            <p className="text-sm">Complete your first workout to see activities here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
          <Badge variant="secondary" className="ml-auto">
            {recentActivities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-full ${activity.bgColor}`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.description}
                    {activity.duration && (
                      <span className="ml-2 inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.duration}m
                      </span>
                    )}
                  </p>
                  
                  {activity.tags && activity.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {activity.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {workouts && workouts.length > 6 && (
          <div className="text-center mt-4">
            <button className="text-sm text-muted-foreground hover:text-primary">
              View all activities
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 