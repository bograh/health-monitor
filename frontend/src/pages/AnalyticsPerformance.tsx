import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchErrorStats, checkHealth } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Activity,
  Server,
  Database,
  Network,
  Cpu,
  HardDrive,
  Globe,
  AlertTriangle,
} from "lucide-react";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: "excellent" | "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  change: number;
  icon: React.ReactNode;
}

interface SystemMetric {
  component: string;
  metric: string;
  current: number;
  average: number;
  max: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
}

export function AnalyticsPerformancePage() {
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">(
    "24h"
  );

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["analytics-performance-stats", timeRange],
    queryFn: fetchErrorStats,
    refetchInterval: 30000,
  });

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["analytics-performance-health"],
    queryFn: checkHealth,
    refetchInterval: 15000,
  });

  // Mock performance metrics (in real app, these would come from actual monitoring)
  const performanceMetrics: PerformanceMetric[] = [
    {
      name: "Response Time",
      value: 245,
      unit: "ms",
      status: "good",
      trend: "down",
      change: -5.2,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      name: "Throughput",
      value: 1250,
      unit: "req/min",
      status: "excellent",
      trend: "up",
      change: 8.3,
      icon: <Zap className="h-4 w-4" />,
    },
    {
      name: "Error Rate",
      value: 0.12,
      unit: "%",
      status: "excellent",
      trend: "down",
      change: -0.05,
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      name: "CPU Usage",
      value: 34,
      unit: "%",
      status: "good",
      trend: "stable",
      change: 0.8,
      icon: <Cpu className="h-4 w-4" />,
    },
    {
      name: "Memory Usage",
      value: 68,
      unit: "%",
      status: "warning",
      trend: "up",
      change: 5.4,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      name: "Disk I/O",
      value: 145,
      unit: "MB/s",
      status: "good",
      trend: "stable",
      change: -1.2,
      icon: <HardDrive className="h-4 w-4" />,
    },
  ];

  const systemMetrics: SystemMetric[] = [
    {
      component: "Web Server",
      metric: "Response Time",
      current: 45,
      average: 52,
      max: 120,
      unit: "ms",
      status: "healthy",
    },
    {
      component: "Database",
      metric: "Query Time",
      current: 12,
      average: 15,
      max: 45,
      unit: "ms",
      status: "healthy",
    },
    {
      component: "Cache",
      metric: "Hit Rate",
      current: 94,
      average: 89,
      max: 100,
      unit: "%",
      status: "healthy",
    },
    {
      component: "Load Balancer",
      metric: "CPU Usage",
      current: 28,
      average: 35,
      max: 85,
      unit: "%",
      status: "healthy",
    },
    {
      component: "API Gateway",
      metric: "Latency",
      current: 8,
      average: 12,
      max: 25,
      unit: "ms",
      status: "healthy",
    },
    {
      component: "Storage",
      metric: "Disk Usage",
      current: 73,
      average: 68,
      max: 90,
      unit: "%",
      status: "warning",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-100";
      case "good":
        return "text-blue-600 bg-blue-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      case "healthy":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3" />;
      case "down":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: string, change: number) => {
    if (trend === "stable") return "text-gray-500";
    // For metrics like error rate, down is good
    if (change < 0) return "text-green-500";
    return "text-red-500";
  };

  if (statsLoading || healthLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-semibold">Performance Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Performance Metrics</h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "1h" | "24h" | "7d" | "30d")
            }
            className="px-3 py-2 border rounded-md"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                {metric.icon}
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                  </div>
                  <Badge className={`mt-1 ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </Badge>
                </div>
                <div
                  className={`flex items-center gap-1 ${getTrendColor(
                    metric.trend,
                    metric.change
                  )}`}
                >
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm">
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Components Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            System Components Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock system metrics since the API doesn't provide component-level data yet */}
            {[
              {
                component: "Web Server",
                metric: "Response Time",
                current: 45,
                average: 52,
                max: 120,
                unit: "ms",
                status: "healthy" as const,
              },
              {
                component: "Database",
                metric: "Query Time",
                current: 12,
                average: 15,
                max: 45,
                unit: "ms",
                status: "healthy" as const,
              },
              {
                component: "Cache",
                metric: "Hit Rate",
                current: 94,
                average: 89,
                max: 100,
                unit: "%",
                status: "healthy" as const,
              },
            ].map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{metric.component}</span>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{metric.metric}</div>
                    <div className="text-sm text-muted-foreground">
                      Current: {metric.current}
                      {metric.unit}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Current</div>
                    <div className="font-semibold">
                      {metric.current}
                      {metric.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Average</div>
                    <div className="font-semibold">
                      {metric.average}
                      {metric.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Peak</div>
                    <div className="font-semibold">
                      {metric.max}
                      {metric.unit}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>0</span>
                    <span>{metric.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.status === "healthy"
                          ? "bg-green-500"
                          : metric.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${(metric.current / metric.max) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Response Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Response time chart for {timeRange}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Average: 245ms, Peak: 890ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Throughput Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Throughput metrics for {timeRange}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Peak: 2,340 req/min, Average: 1,250 req/min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network & Infrastructure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Network & Infrastructure Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Globe className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold">15ms</div>
              <div className="text-sm text-muted-foreground">DB Latency</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Network className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-bold">2.3GB</div>
              <div className="text-sm text-muted-foreground">Bandwidth</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Server className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-lg font-bold">5/5</div>
              <div className="text-sm text-muted-foreground">Servers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Alerts */}
      {stats && stats.data?.total_errors > 30 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">
                Performance Alert
              </span>
              <Badge variant="outline" className="text-yellow-700">
                Elevated Error Rate
              </Badge>
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              Total errors: {stats.data.total_errors}. Consider investigating
              system performance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
