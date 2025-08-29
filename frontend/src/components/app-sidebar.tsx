import * as React from "react";
import { Link } from "react-router-dom";
import {
  Command,
  Home,
  AlertTriangle,
  BarChart3,
  Bell,
  Settings,
  Activity,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@healthmonitor.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Real-time",
          url: "/dashboard/realtime",
        },
      ],
    },
    {
      title: "Error Logs",
      url: "/errors",
      icon: AlertTriangle,
      items: [
        {
          title: "All Errors",
          url: "/errors/all",
        },
        {
          title: "Unresolved",
          url: "/errors/unresolved",
        },
        {
          title: "Critical",
          url: "/errors/critical",
        },
        {
          title: "Recent",
          url: "/errors/recent",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Error Trends",
          url: "/analytics/trends",
        },
        {
          title: "Performance",
          url: "/analytics/performance",
        },
        {
          title: "Reports",
          url: "/analytics/reports",
        },
      ],
    },
    {
      title: "Monitoring",
      url: "/monitoring",
      icon: Activity,
      items: [
        {
          title: "Service Health",
          url: "/monitoring/health",
        },
        {
          title: "Uptime",
          url: "/monitoring/uptime",
        },
        {
          title: "Metrics",
          url: "/monitoring/metrics",
        },
      ],
    },
    {
      title: "Alerts",
      url: "/alerts",
      icon: Bell,
      items: [
        {
          title: "Alert Rules",
          url: "/alerts/rules",
        },
        {
          title: "Notifications",
          url: "/alerts/notifications",
        },
        {
          title: "Incidents",
          url: "/alerts/incidents",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "API Keys",
          url: "/settings/api-keys",
        },
        {
          title: "Integrations",
          url: "/settings/integrations",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Health Monitor</span>
                  <span className="truncate text-xs">
                    Error Tracking & Analytics
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
