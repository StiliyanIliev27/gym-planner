"use client"

import * as React from "react"
import {
  Dumbbell,
  LayoutDashboard,
  Target,
  Calendar,
  BarChart3,
  Apple,
  Settings,
  Trophy,
  Activity,
  User,
  BookOpen,
} from "lucide-react"

import { NavMain } from "@/components/common/navigation/sidebar/nav-main"
import { NavProjects } from "@/components/common/navigation/sidebar/nav-projects"
import { NavUser } from "@/components/common/navigation/sidebar/nav-user"
import { TeamSwitcher } from "@/components/common/navigation/team-switcher"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Fitness app navigation data
const data = {
  user: {
    name: "John Doe",
    email: "john@fitnesstracker.com",
    avatar: "/avatars/user.jpg",
  },
  brand: {
    name: "GymPlanner",
    logo: Dumbbell,
    version: "Pro",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      isDirectLink: true,
    },
    {
      title: "Workouts",
      url: "#",
      icon: Dumbbell,
      items: [
        {
          title: "AI Workout Builder",
          url: "/workout-builder",
        },
        {
          title: "My Workouts",
          url: "/my-workouts",
        },
        {
          title: "Exercise Library",
          url: "/exercises",
        },
        {
          title: "Training History",
          url: "/training-history",
        },
      ],
    },
    {
      title: "Nutrition",
      url: "#",
      icon: Apple,
      items: [
        {
          title: "Diet Builder",
          url: "/diet-builder",
        },
        {
          title: "Meal Plans",
          url: "/meal-plans",
        },
        {
          title: "Food Tracker",
          url: "/food-tracker",
        },
        {
          title: "Recipes",
          url: "/recipes",
        },
      ],
    },
    {
      title: "Progress",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Body Metrics",
          url: "/progress/body",
        },
        {
          title: "Strength Progress",
          url: "/progress/strength",
        },
        {
          title: "Workout Analytics",
          url: "/progress/workouts",
        },
        {
          title: "Photos",
          url: "/progress/photos",
        },
      ],
    },
    {
      title: "Goals",
      url: "#",
      icon: Target,
      items: [
        {
          title: "Set Goals",
          url: "/goals/create",
        },
        {
          title: "My Goals",
          url: "/goals",
        },
        {
          title: "Achievements",
          url: "/achievements",
        },
      ],
    },
  ],
  quickActions: [
    {
      name: "Start Workout",
      url: "/workout/start",
      icon: Activity,
    },
    {
      name: "Log Food",
      url: "/food/log",
      icon: Apple,
    },
    {
      name: "Track Progress",
      url: "/progress/update",
      icon: Trophy,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher brand={data.brand} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.quickActions} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

