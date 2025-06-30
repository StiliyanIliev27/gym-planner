"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  Plus,
  TrendingUp,
  Target,
  Calendar,
  Timer,
  Utensils,
  BarChart3,
  Settings,
  Award
} from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  const quickActions = [
    {
      icon: Play,
      title: "Start Workout",
      description: "Begin today's session",
      href: "/workout-builder",
      variant: "default",
      badge: "Ready",
      color: "bg-green-500"
    },
    {
      icon: Plus,
      title: "Log Activity",
      description: "Record completed exercise",
      href: "#",
      variant: "outline",
      badge: null,
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Update Progress",
      description: "Log weight & measurements",
      href: "#",
      variant: "outline",
      badge: "Due",
      color: "bg-purple-500"
    },
    {
      icon: Target,
      title: "Set Goals",
      description: "Define new targets",
      href: "#",
      variant: "outline",
      badge: null,
      color: "bg-orange-500"
    },
    {
      icon: Calendar,
      title: "Plan Week",
      description: "Schedule workouts",
      href: "#",
      variant: "outline",
      badge: null,
      color: "bg-indigo-500"
    },
    {
      icon: Utensils,
      title: "Meal Planning",
      description: "Design nutrition plan",
      href: "/diet-builder",
      variant: "outline",
      badge: "New",
      color: "bg-emerald-500"
    },
    {
      icon: BarChart3,
      title: "View Analytics",
      description: "Detailed progress report",
      href: "#",
      variant: "outline",
      badge: null,
      color: "bg-pink-500"
    },
    {
      icon: Award,
      title: "Achievements",
      description: "View milestones",
      href: "#",
      variant: "outline",
      badge: "3 New",
      color: "bg-yellow-500"
    }
  ];

  // Show only first 6 actions on mobile, all on desktop
  const actionsToShow = quickActions.slice(0, 6);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actionsToShow.map((action, index) => {
            const IconComponent = action.icon;
            const content = (
              <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer border border-border/50 hover:border-primary/20 hover:scale-[1.02]">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="relative">
                      <div className={`p-2 ${action.color} rounded-lg mx-auto w-fit group-hover:scale-110 transition-transform`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      {action.badge && (
                        <Badge 
                          variant="secondary" 
                          className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5 h-auto"
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );

            return action.href.startsWith('/') ? (
              <Link key={index} href={action.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={index} onClick={() => console.log(`Clicked: ${action.title}`)}>
                {content}
              </div>
            );
          })}
        </div>

        {/* Show More Actions Button */}
        <div className="flex justify-center mt-4">
          <Button variant="ghost" size="sm" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Customize Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 