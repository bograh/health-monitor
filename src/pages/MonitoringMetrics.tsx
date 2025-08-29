import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkErrorApiHealth } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Database,
  Zap,
  Thermometer,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from "lucide-react";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  threshold: {
    warning: number;
    critical: number;
  };
  trend: "up" | "down" | "stable";
  change: number;
  icon: React.ReactNode;
  description: string;
}

interface ResourceUsage {
  component: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  status: "healthy" | "warning" | "critical";
  location: string;
}

export function MonitoringMetricsPage() {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d">("6h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (autoRefresh) {
      const timer = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000);
      return () => clearInterval(timer);
    }
  }, [autoRefresh]);

  const { data: health, isLoading } = useQuery({
    queryKey: ["metrics-health", timeRange],
    queryFn: checkErrorApiHealth,
    refetchInterval: autoRefresh ? 30000 : false,
  });

  // Mock system metrics (in real app, these would come from monitoring agents)
  const systemMetrics: SystemMetric[] = [
    {
      name: "CPU Usage",
      value: 34.5,
      unit: "%",
      status: "healthy",
      threshold: { warning: 70, critical: 85 },
      trend: "stable",
      change: 0.5,
      icon: <Cpu className="h-4 w-4" />,
      description: "Average CPU utilization across all cores",
    },
    {
      name: "Memory Usage",
      value: 68.2,
      unit: "%",
      status: "warning",
      threshold: { warning: 70, critical: 90 },
      trend: "up",
      change: 5.3,
      icon: <MemoryStick className="h-4 w-4" />,
      description: "System RAM utilization",
    },
    {
      name: "Disk Usage",
      value: 45.8,
      unit: "%",
      status: "healthy",
      threshold: { warning: 80, critical: 95 },
      trend: "up",
      change: 2.1,
      icon: <HardDrive className="h-4 w-4" />,
      description: "Primary disk space utilization",
    },
    {
      name: "Network I/O",
      value: 256,
      unit: "MB/s",
      status: "healthy",
      threshold: { warning: 800, critical: 950 },
      trend: "stable",
      change: -1.2,
      icon: <Network className="h-4 w-4" />,
      description: "Network throughput (ingress + egress)",
    },
    {
      name: "Database Connections",
      value: 45,
      unit: "connections",
      status: "healthy",
      threshold: { warning: 80, critical: 95 },
      trend: "down",
      change: -2.5,
      icon: <Database className="h-4 w-4" />,
      description: "Active database connections",
    },
    {
      name: "Response Time",
      value: 245,
      unit: "ms",
      status: "healthy",
      threshold: { warning: 500, critical: 1000 },
      trend: "down",
      change: -8.3,
      icon: <Zap className="h-4 w-4" />,
      description: "Average API response time",
    },
    {
      name: "Temperature",
      value: 42,
      unit: "°C",
      status: "healthy",
      threshold: { warning: 70, critical: 85 },
      trend: "stable",
      change: 1.0,
      icon: <Thermometer className="h-4 w-4" />,
      description: "System temperature",
    },
    {
      name: "Load Average",
      value: 1.25,
      unit: "",
      status: "healthy",
      threshold: { warning: 2.0, critical: 4.0 },
      trend: "stable",
      change: 0.1,
      icon: <Gauge className="h-4 w-4" />,
      description: "System load average (5 min)",
    },
  ];

  const resourceUsage: ResourceUsage[] = [
    {
      component: "Web Server 1",
      cpu: 28,
      memory: 62,
      disk: 34,
      network: 145,
      status: "healthy",
      location: "us-east-1a",
    },
    {
      component: "Web Server 2",
      cpu: 31,
      memory: 58,
      disk: 36,
      network: 156,
      status: "healthy",
      location: "us-east-1b",
    },
    {
      component: "Database Primary",
      cpu: 45,
      memory: 78,
      disk: 67,
      network: 89,
      status: "warning",
      location: "us-east-1a",
    },
    {
      component: "Database Replica",
      cpu: 23,
      memory: 45,
      disk: 67,
      network: 67,
      status: "healthy",
      location: "us-east-1c",
    },
    {
      component: "Cache Server",
      cpu: 15,
      memory: 34,
      disk: 12,
      network: 234,
      status: "healthy",
      location: "us-east-1b",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
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
    if (Math.abs(change) < 1) return "text-gray-500";
    if (change > 0) return "text-red-500";
    return "text-green-500";
  };

  const getUsageColor = (value: number, type: string) => {
    const threshold = type === "memory" || type === "disk" ? 70 : 80;
    if (value >= 90) return "bg-red-500";
    if (value >= threshold) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-semibold">System Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
          <h1 className="text-2xl font-semibold">System Metrics</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? "Pause" : "Resume"}
            </Button>
            <select
              value={timeRange}
              onChange={(e) =>
                setTimeRange(e.target.value as "1h" | "6h" | "24h" | "7d")
              }
              className="px-3 py-2 border rounded-md"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                {metric.icon}
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
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
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
              {/* Progress bar */}
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      metric.status === "healthy"
                        ? "bg-green-500"
                        : metric.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (metric.value / metric.threshold.critical) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span className="text-yellow-600">
                    W: {metric.threshold.warning}
                  </span>
                  <span className="text-red-600">
                    C: {metric.threshold.critical}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resource Usage by Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Resource Usage by Component
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resourceUsage.map((resource, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">
                        {resource.component}
                      </span>
                    </div>
                    <Badge className={getStatusColor(resource.status)}>
                      {resource.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {resource.location}
                    </Badge>
                  </div>
                  {getStatusIcon(resource.status)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="h-3 w-3" />
                      <span className="text-sm font-medium">CPU</span>
                    </div>
                    <div className="text-lg font-bold">{resource.cpu}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getUsageColor(
                          resource.cpu,
                          "cpu"
                        )}`}
                        style={{ width: `${resource.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MemoryStick className="h-3 w-3" />
                      <span className="text-sm font-medium">Memory</span>
                    </div>
                    <div className="text-lg font-bold">{resource.memory}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getUsageColor(
                          resource.memory,
                          "memory"
                        )}`}
                        style={{ width: `${resource.memory}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <HardDrive className="h-3 w-3" />
                      <span className="text-sm font-medium">Disk</span>
                    </div>
                    <div className="text-lg font-bold">{resource.disk}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getUsageColor(
                          resource.disk,
                          "disk"
                        )}`}
                        style={{ width: `${resource.disk}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Network className="h-3 w-3" />
                      <span className="text-sm font-medium">Network</span>
                    </div>
                    <div className="text-lg font-bold">
                      {resource.network}MB/s
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getUsageColor(
                          (resource.network / 1000) * 100,
                          "network"
                        )}`}
                        style={{
                          width: `${Math.min(
                            (resource.network / 1000) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              CPU & Memory Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  CPU and Memory usage over {timeRange}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Current: CPU 34.5%, Memory 68.2%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network & Disk I/O
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Network className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  I/O metrics for {timeRange}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Network: 256 MB/s, Disk: 45.8% used
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Thresholds */}
      {systemMetrics.some(
        (m) => m.status === "warning" || m.status === "critical"
      ) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">
                System Alerts
              </span>
            </div>
            <div className="space-y-1">
              {systemMetrics
                .filter(
                  (m) => m.status === "warning" || m.status === "critical"
                )
                .map((metric, index) => (
                  <div key={index} className="text-sm text-yellow-700">
                    • {metric.name}: {metric.value}
                    {metric.unit} ({metric.status})
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
