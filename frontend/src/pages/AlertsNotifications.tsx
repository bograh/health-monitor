import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchErrorStats } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Smartphone,
  Settings,
  Eye,
  EyeOff,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Filter,
  Search,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "error" | "warning" | "info" | "success";
  channel: "email" | "slack" | "sms" | "webhook" | "in-app";
  priority: "low" | "medium" | "high" | "critical";
  timestamp: string;
  isRead: boolean;
  source: string;
  actionRequired: boolean;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: "email" | "slack" | "sms" | "webhook" | "in-app";
  enabled: boolean;
  icon: React.ReactNode;
  description: string;
  lastUsed: string | null;
  deliveryRate: number;
}

export function AlertsNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "channels" | "settings">(
    "inbox"
  );
  const [filterType, setFilterType] = useState<"all" | "unread" | "critical">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats } = useQuery({
    queryKey: ["notifications-stats"],
    queryFn: fetchErrorStats,
    refetchInterval: 60000,
  });

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: "1",
      title: "High Error Rate Detected",
      message:
        "Error rate has exceeded 5% in the last 10 minutes. Immediate attention required.",
      type: "error",
      channel: "email",
      priority: "critical",
      timestamp: "2024-01-15T14:30:00Z",
      isRead: false,
      source: "Error Monitoring",
      actionRequired: true,
    },
    {
      id: "2",
      title: "Database Connection Pool Warning",
      message:
        "Database connection pool is at 85% capacity. Consider scaling up.",
      type: "warning",
      channel: "slack",
      priority: "high",
      timestamp: "2024-01-15T14:15:00Z",
      isRead: false,
      source: "Infrastructure",
      actionRequired: true,
    },
    {
      id: "3",
      title: "Deployment Successful",
      message: "Version 2.1.4 has been successfully deployed to production.",
      type: "success",
      channel: "slack",
      priority: "medium",
      timestamp: "2024-01-15T13:45:00Z",
      isRead: true,
      source: "CI/CD",
      actionRequired: false,
    },
    {
      id: "4",
      title: "SSL Certificate Renewal",
      message:
        "SSL certificate for api.healthmonitor.com will expire in 30 days.",
      type: "warning",
      channel: "email",
      priority: "medium",
      timestamp: "2024-01-15T12:00:00Z",
      isRead: true,
      source: "Security",
      actionRequired: true,
    },
    {
      id: "5",
      title: "Memory Usage Alert",
      message: "Server memory usage has reached 90% on web-server-01.",
      type: "error",
      channel: "sms",
      priority: "high",
      timestamp: "2024-01-15T11:30:00Z",
      isRead: false,
      source: "Infrastructure",
      actionRequired: true,
    },
    {
      id: "6",
      title: "Backup Completed",
      message: "Daily database backup completed successfully.",
      type: "info",
      channel: "in-app",
      priority: "low",
      timestamp: "2024-01-15T06:00:00Z",
      isRead: true,
      source: "Backup Service",
      actionRequired: false,
    },
  ];

  const channels: NotificationChannel[] = [
    {
      id: "email",
      name: "Email",
      type: "email",
      enabled: true,
      icon: <Mail className="h-4 w-4" />,
      description: "Send notifications to registered email addresses",
      lastUsed: "2024-01-15T14:30:00Z",
      deliveryRate: 98.5,
    },
    {
      id: "slack",
      name: "Slack",
      type: "slack",
      enabled: true,
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Post notifications to #alerts channel",
      lastUsed: "2024-01-15T14:15:00Z",
      deliveryRate: 99.2,
    },
    {
      id: "sms",
      name: "SMS",
      type: "sms",
      enabled: true,
      icon: <Smartphone className="h-4 w-4" />,
      description: "Send critical alerts via SMS",
      lastUsed: "2024-01-15T11:30:00Z",
      deliveryRate: 95.8,
    },
    {
      id: "webhook",
      name: "Webhook",
      type: "webhook",
      enabled: false,
      icon: <Bell className="h-4 w-4" />,
      description: "Send notifications to custom webhook endpoints",
      lastUsed: null,
      deliveryRate: 0,
    },
    {
      id: "in-app",
      name: "In-App",
      type: "in-app",
      enabled: true,
      icon: <Bell className="h-4 w-4" />,
      description: "Show notifications within the dashboard",
      lastUsed: "2024-01-15T06:00:00Z",
      deliveryRate: 100,
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-600 bg-red-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      case "success":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-700 bg-red-200";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-3 w-3" />;
      case "slack":
        return <MessageSquare className="h-3 w-3" />;
      case "sms":
        return <Smartphone className="h-3 w-3" />;
      case "webhook":
        return <Bell className="h-3 w-3" />;
      case "in-app":
        return <Bell className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filterType === "all" ||
      (filterType === "unread" && !notification.isRead) ||
      (filterType === "critical" && notification.priority === "critical");

    const matchesSearch =
      searchTerm === "" ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.source.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const criticalCount = notifications.filter(
    (n) => n.priority === "critical"
  ).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Notifications Center</h1>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab("inbox")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "inbox"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Inbox ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab("channels")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "channels"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors ${
            activeTab === "settings"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Inbox Tab */}
      {activeTab === "inbox" && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Unread</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {unreadCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Critical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {criticalCount}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Action Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {notifications.filter((n) => n.actionRequired).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
                <option value="critical">Critical Only</option>
              </select>
            </div>

            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md"
              />
            </div>

            <Button variant="outline" size="sm">
              Mark All Read
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  !notification.isRead ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(notification.channel)}
                          <span className="font-semibold">
                            {notification.title}
                          </span>
                        </div>
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        <Badge
                          className={getPriorityColor(notification.priority)}
                        >
                          {notification.priority}
                        </Badge>
                        {notification.actionRequired && (
                          <Badge variant="outline" className="text-orange-600">
                            Action Required
                          </Badge>
                        )}
                        {!notification.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>From: {notification.source}</span>
                        <span>Via: {notification.channel}</span>
                        <span>{formatTimestamp(notification.timestamp)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        {notification.isRead ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Channels Tab */}
      {activeTab === "channels" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <Card key={channel.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {channel.icon}
                    {channel.name}
                    <Badge variant={channel.enabled ? "default" : "secondary"}>
                      {channel.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {channel.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Delivery Rate:</span>
                      <span className="font-semibold">
                        {channel.deliveryRate}%
                      </span>
                    </div>

                    {channel.lastUsed && (
                      <div className="flex justify-between text-sm">
                        <span>Last Used:</span>
                        <span>{formatTimestamp(channel.lastUsed)}</span>
                      </div>
                    )}

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${channel.deliveryRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      Configure
                    </Button>
                    <Button
                      variant={channel.enabled ? "destructive" : "default"}
                      size="sm"
                      className="flex-1"
                    >
                      {channel.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Quiet Hours</div>
                  <div className="text-sm text-muted-foreground">
                    Suppress non-critical notifications during specified hours
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Set Hours
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Digest Summary</div>
                  <div className="text-sm text-muted-foreground">
                    Daily summary of all notifications
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priority Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-2">Critical Errors</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Send immediate notifications via all channels
                  </div>
                  <div className="flex gap-2">
                    <Badge>Email</Badge>
                    <Badge>Slack</Badge>
                    <Badge>SMS</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-2">Warnings</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Send notifications during business hours
                  </div>
                  <div className="flex gap-2">
                    <Badge>Email</Badge>
                    <Badge>Slack</Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="font-semibold mb-2">Information</div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Include in daily digest only
                  </div>
                  <div className="flex gap-2">
                    <Badge>In-App</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
