import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkErrorApiHealth, fetchErrorStats } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  TrendingUp,
  TrendingDown,
  Zap,
  Users,
  Globe,
  Shield,
  Database,
} from "lucide-react";

interface QuickStatusItem {
  label: string;
  value: string | number;
  status: "healthy" | "warning" | "critical";
  icon: React.ReactNode;
  change?: number;
  unit?: string;
}

export function APIHealthIndicator() {
  const { data: health, isLoading } = useQuery({
    queryKey: ["quick-health"],
    queryFn: checkErrorApiHealth,
    refetchInterval: 15000,
  });

  const isHealthy = health?.status === "ok";
  const statusColor = isHealthy ? "text-green-600" : "text-red-600";
  const bgColor = isHealthy ? "bg-green-100" : "bg-red-100";

  return (
    <Card className="min-w-[250px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Server className="h-4 w-4" />
          API Health Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-lg font-bold ${statusColor}`}>
                {isHealthy ? "Operational" : "Issues Detected"}
              </div>
              <div className="text-xs text-muted-foreground">
                Last checked: {new Date().toLocaleTimeString()}
              </div>
            </div>
            <div className={`p-2 rounded-full ${bgColor}`}>
              {isHealthy ? (
                <CheckCircle className={`h-6 w-6 ${statusColor}`} />
              ) : (
                <AlertTriangle className={`h-6 w-6 ${statusColor}`} />
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SystemStatusOverview() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: stats } = useQuery({
    queryKey: ["quick-stats"],
    queryFn: fetchErrorStats,
    refetchInterval: 30000,
  });

  const { data: health } = useQuery({
    queryKey: ["quick-health-overview"],
    queryFn: checkErrorApiHealth,
    refetchInterval: 30000,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const statusItems: QuickStatusItem[] = [
    {
      label: "API Status",
      value: health?.status === "ok" ? "Operational" : "Degraded",
      status: health?.status === "ok" ? "healthy" : "critical",
      icon: <Server className="h-4 w-4" />,
    },
    {
      label: "Errors Today",
      value: stats?.errors_today || 0,
      status: (stats?.errors_today || 0) > 50 ? "warning" : "healthy",
      icon: <AlertTriangle className="h-4 w-4" />,
      change: 5.2,
    },
    {
      label: "Uptime",
      value: "99.9",
      status: "healthy",
      icon: <Activity className="h-4 w-4" />,
      unit: "%",
    },
    {
      label: "Response Time",
      value: 245,
      status: "healthy",
      icon: <Zap className="h-4 w-4" />,
      unit: "ms",
      change: -3.8,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-red-500";
    if (change < 0) return "text-green-500";
    return "text-gray-500";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <Activity className="h-3 w-3" />;
  };

  return (
    <Card className="min-w-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            System Status Overview
          </div>
          <div className="text-xs text-muted-foreground">
            {currentTime.toLocaleTimeString()}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {statusItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-medium">{item.label}:</span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold">
                    {item.value}
                    {item.unit}
                  </span>
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
                {item.change !== undefined && (
                  <div
                    className={`flex items-center gap-1 text-xs ${getChangeColor(
                      item.change
                    )}`}
                  >
                    {getChangeIcon(item.change)}
                    <span>
                      {item.change > 0 ? "+" : ""}
                      {item.change}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickAccessDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<
    "errors" | "performance" | "infrastructure"
  >("errors");

  const { data: stats } = useQuery({
    queryKey: ["quick-dashboard"],
    queryFn: fetchErrorStats,
    refetchInterval: 30000,
  });

  const metricsData = {
    errors: [
      {
        label: "Total Errors",
        value: stats?.total_errors || 0,
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "text-red-600",
      },
      {
        label: "Resolved",
        value: stats?.resolved_errors || 0,
        icon: <CheckCircle className="h-5 w-5" />,
        color: "text-green-600",
      },
      {
        label: "This Week",
        value: stats?.errors_this_week || 0,
        icon: <TrendingUp className="h-5 w-5" />,
        color: "text-blue-600",
      },
    ],
    performance: [
      {
        label: "Response Time",
        value: "245ms",
        icon: <Zap className="h-5 w-5" />,
        color: "text-blue-600",
      },
      {
        label: "Throughput",
        value: "1.2K req/min",
        icon: <Activity className="h-5 w-5" />,
        color: "text-green-600",
      },
      {
        label: "CPU Usage",
        value: "34%",
        icon: <Server className="h-5 w-5" />,
        color: "text-orange-600",
      },
    ],
    infrastructure: [
      {
        label: "Uptime",
        value: "99.9%",
        icon: <Globe className="h-5 w-5" />,
        color: "text-green-600",
      },
      {
        label: "Active Users",
        value: "1.2K",
        icon: <Users className="h-5 w-5" />,
        color: "text-purple-600",
      },
      {
        label: "DB Latency",
        value: "12ms",
        icon: <Database className="h-5 w-5" />,
        color: "text-blue-600",
      },
    ],
  };

  return (
    <Card className="min-w-[500px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4" />
          Quick Access Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Metric Selector */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1 mb-4">
          <button
            onClick={() => setSelectedMetric("errors")}
            className={`flex-1 text-xs font-medium py-1 px-2 rounded-md transition-colors ${
              selectedMetric === "errors"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Errors
          </button>
          <button
            onClick={() => setSelectedMetric("performance")}
            className={`flex-1 text-xs font-medium py-1 px-2 rounded-md transition-colors ${
              selectedMetric === "performance"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setSelectedMetric("infrastructure")}
            className={`flex-1 text-xs font-medium py-1 px-2 rounded-md transition-colors ${
              selectedMetric === "infrastructure"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Infrastructure
          </button>
        </div>

        {/* Metrics Display */}
        <div className="grid grid-cols-3 gap-3">
          {metricsData[selectedMetric].map((metric, index) => (
            <div key={index} className="text-center p-3 border rounded-lg">
              <div className={`flex justify-center mb-2 ${metric.color}`}>
                {metric.icon}
              </div>
              <div className="text-lg font-bold">{metric.value}</div>
              <div className="text-xs text-muted-foreground">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="outline" size="sm" className="h-8">
            <AlertTriangle className="h-3 w-3 mr-1" />
            View Errors
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Activity className="h-3 w-3 mr-1" />
            Live Feed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickAccessPanel() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <APIHealthIndicator />
        <SystemStatusOverview />
        <QuickAccessDashboard />
      </div>
    </div>
  );
}
