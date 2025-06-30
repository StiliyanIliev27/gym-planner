"use client";
import { AppSidebar } from "@/components/common/navigation/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import React from "react";
import { ModeToggle } from "@/components/common/theme/mode-toggle";
import { usePathname } from "next/navigation";
import { Bell, Search, Plus } from "lucide-react";

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [];
  
  // Custom mapping for better breadcrumb names
  const nameMapping = {
    'dashboard': 'Dashboard',
    'workout-builder': 'Workout Builder',
    'diet-builder': 'Diet Builder',
    'workouts': 'My Workouts',
    'progress': 'Progress',
    'goals': 'Goals',
    'settings': 'Settings',
  };

  for (let i = 0; i < segments.length; i++) {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const segment = segments[i];
    const title = nameMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');

    breadcrumbs.push({
      title,
      href: i === segments.length - 1 ? undefined : href, // Last item has no href
    });
  }

  return breadcrumbs;
}

export function AuthenticatedLayout({ children }) {
  const pathname = usePathname();
  const breadcrumb = generateBreadcrumbs(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumb?.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <BreadcrumbItem>
                      {item.href ? (
                        <BreadcrumbLink href={item.href} className="text-muted-foreground hover:text-foreground">
                          {item.title}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-medium">{item.title}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {idx < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Quick Add
            </Button>
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
