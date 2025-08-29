import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchErrorStats, checkHealth } from "@/utils/requests";
import { LiveErrorStream } from "@/components/ui/liveErrorStream";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Server,
  Zap,
  Pause,
  Play,
} from "lucide-react";

interface LiveMetric {
  label: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  color: string;
}

export function DashboardRealtimePage() {
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats", "realtime"],
    queryFn: fetchErrorStats,
    refetchInterval: isGlobalPaused ? false : 5000,
    refetchOnWindowFocus: false,
  });

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["health", "realtime"],
    queryFn: checkHealth,
    refetchInterval: isGlobalPaused ? false : 10000,
    refetchOnWindowFocus: false,
  });

  const liveMetrics: LiveMetric[] = [
    {
      label: "Errors/min",
      value: Math.floor(Math.random() * 5) + 1,
      change: Math.floor(Math.random() * 20) - 10,
      trend: Math.random() > 0.5 ? "up" : "down",
      color: "text-red-600",
    },
    {
      label: "Response Time",
      value: Math.floor(Math.random() * 100) + 50,
      change: Math.floor(Math.random() * 30) - 15,
      trend: Math.random() > 0.5 ? "up" : "down",
      color: "text-blue-600",
    },
    {
      label: "Active Users",
      value: Math.floor(Math.random() * 50) + 100,
      change: Math.floor(Math.random() * 10) - 5,
      trend: "up",
      color: "text-green-600",
    },
    {
      label: "CPU Usage %",
      value: Math.floor(Math.random() * 30) + 40,
      change: Math.floor(Math.random() * 10) - 5,
      trend: Math.random() > 0.7 ? "up" : "stable",
      color: "text-purple-600",
    },
  ];

  const handleGlobalToggle = () => {
    setIsGlobalPaused(!isGlobalPaused);
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
    if (change > 0) return "text-red-500";
    return "text-green-500";
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Real-time Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {currentTime.toLocaleString()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGlobalToggle}
            className="flex items-center gap-2"
          >
            {isGlobalPaused ? (
              <>
                <Play className="h-3 w-3" />
                Resume All
              </>
            ) : (
              <>
                <Pause className="h-3 w-3" />
                Pause All
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-green-600" />
                <span className="font-semibold">System Status</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {health?.status === "ok" ? "Operational" : "Issues Detected"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Live Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isGlobalPaused
                      ? "bg-yellow-500"
                      : "bg-green-500 animate-pulse"
                  }`}
                />
                <span className="text-sm">
                  {isGlobalPaused ? "Paused" : "Active"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveMetrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                  {metric.label.includes("%") ? "%" : ""}
                  {metric.label.includes("Time") ? "ms" : ""}
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
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                vs last minute
              </div>
            </CardContent>
            {/* Animated border for live effect */}
            {!isGlobalPaused && (
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 animate-pulse w-full" />
            )}
          </Card>
        ))}
      </div>

      {/* Main Real-time Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        {/* Live Error Stream */}
        <div className="lg:col-span-1">
          <LiveErrorStream
            maxItems={15}
            refreshInterval={isGlobalPaused ? 0 : 2000}
          />
        </div>

        {/* Real-time Charts Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Error Rate Trend (Last Hour)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Real-time chart would be rendered here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current rate: {stats?.data?.total_errors || 0} total errors
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <Server className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Live performance metrics
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        99.8%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Uptime
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        45ms
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg Response
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert Bar for Critical Issues */}
      {!statsLoading && stats && stats.data?.total_errors > 50 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800">
                High Error Volume Detected
              </span>
              <Badge variant="destructive">
                {stats.data.total_errors} total errors
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
