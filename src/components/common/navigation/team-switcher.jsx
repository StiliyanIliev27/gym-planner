"use client"

import * as React from "react"
import { Dumbbell } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  brand
}) {
  if (!brand) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div
            className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <brand.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{brand.name}</span>
            <span className="truncate text-xs text-muted-foreground">{brand.version}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
