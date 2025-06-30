"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity,
  TrendingUp,
  Award,
  Target,
  Clock,
  CheckCircle,
  Flame,
  Droplets,
  Calendar,
  User
} from "lucide-react";

export default function ActivityFeed() {
  const activities = [
    {
      type: "workout",
      icon: Activity,
      title: "Completed Upper Body Strength",
      description: "45 minutes • 8 exercises • 320 calories burned",
      time: "2 hours ago",
      details: {
        duration: "45 min",
        exercises: 8,
        calories: 320,
        intensity: "High"
      },
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      type: "progress",
      icon: TrendingUp,
      title: "Weight Progress Updated",
      description: "Lost 0.3kg this week - great progress!",
      time: "5 hours ago",
      details: {
        previousWeight: "82.3 kg",
        currentWeight: "82.0 kg",
        change: "-0.3 kg"
      },
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      type: "achievement",
      icon: Award,
      title: "Achievement Unlocked!",
      description: "Completed 4 workouts this week - Weekly Warrior!",
      time: "1 day ago",
      details: {
        achievement: "Weekly Warrior",
        requirement: "4 workouts in one week",
        points: "+50 XP"
      },
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
    },
    {
      type: "goal",
      icon: Target,
      title: "New Goal Set",
      description: "Target: Reach 80kg by end of month",
      time: "2 days ago",
      details: {
        goalType: "Weight Loss",
        target: "80 kg",
        deadline: "End of month",
        current: "82 kg"
      },
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      type: "habit",
      icon: Droplets,
      title: "Daily Hydration Goal",
      description: "Reached 8 glasses of water for 3rd day in a row",
      time: "3 days ago",
      details: {
        streak: "3 days",
        target: "8 glasses",
        achieved: "8 glasses"
      },
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/20"
    }
  ];

  const stats = {
    totalWorkouts: 12,
    totalCalories: 3850,
    currentStreak: 5,
    weeklyGoalProgress: 80
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            Activity Feed
          </div>
          <Badge variant="outline" className="text-xs">
            {activities.length} recent
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Your latest fitness activities and achievements
        </p>
      </CardHeader>
      <CardContent>
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 bg-accent/20 rounded-lg">
            <Activity className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-sm font-medium">{stats.totalWorkouts}</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </div>
          <div className="text-center p-2 bg-accent/20 rounded-lg">
            <Flame className="h-4 w-4 text-orange-600 mx-auto mb-1" />
            <p className="text-sm font-medium">{stats.totalCalories}</p>
            <p className="text-xs text-muted-foreground">Total Cal</p>
          </div>
          <div className="text-center p-2 bg-accent/20 rounded-lg">
            <Calendar className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium">{stats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="text-center p-2 bg-accent/20 rounded-lg">
            <Target className="h-4 w-4 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium">{stats.weeklyGoalProgress}%</p>
            <p className="text-xs text-muted-foreground">Goals</p>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</h4>
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div key={index} className="relative">
                {/* Timeline connector */}
                {index < activities.length - 1 && (
                  <div className="absolute left-6 top-8 w-px h-8 bg-border" />
                )}
                
                <div className={`flex gap-3 p-3 rounded-lg ${activity.bgColor} hover:bg-accent/40 transition-colors`}>
                  <div className={`p-2 bg-white dark:bg-card rounded-lg shadow-sm`}>
                    <IconComponent className={`h-4 w-4 ${activity.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                    
                    {/* Activity Details */}
                    {activity.details && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(activity.details).map(([key, value]) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More Button */}
        <div className="flex justify-center mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="text-xs">
            <User className="h-3 w-3 mr-1" />
            View Full Activity History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 