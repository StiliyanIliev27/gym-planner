"use client";
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
  Zap
} from "lucide-react";

export default function SmartInsights() {
  const insights = [
    {
      type: "success",
      icon: CheckCircle,
      title: "Great Progress!",
      description: "You've exceeded your workout goal this week. Keep up the momentum!",
      priority: "high",
      action: "Continue current routine"
    },
    {
      type: "tip",
      icon: Lightbulb,
      title: "Optimize Recovery",
      description: "Based on your workout intensity, consider adding 15min of stretching.",
      priority: "medium",
      action: "Add stretching session"
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Hydration Check",
      description: "Your water intake has been below target for 3 days. Stay hydrated!",
      priority: "medium",
      action: "Set water reminders"
    },
    {
      type: "trend",
      icon: TrendingUp,
      title: "Weight Loss Trend",
      description: "You're losing weight at an optimal rate of 0.5kg per week.",
      priority: "low",
      action: "Maintain current approach"
    }
  ];

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

  const todaysTip = {
    title: "Today's Focus",
    tip: "Progressive overload: Try increasing your weight by 2.5kg on squats today!",
    category: "Strength Training"
  };

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
            AI-powered recommendations based on your activity
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.slice(0, 3).map((insight, index) => {
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
          
          <Button variant="outline" className="w-full mt-3" size="sm">
            View All Insights
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 