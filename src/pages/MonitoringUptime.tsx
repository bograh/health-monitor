import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { checkErrorApiHealth } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Server,
  Globe,
  Wifi,
  Calendar,
  BarChart3,
} from "lucide-react";

interface UptimeRecord {
  timestamp: string;
  status: "up" | "down" | "degraded";
  responseTime: number;
  location: string;
}

interface ServiceUptime {
  service: string;
  status: "operational" | "degraded" | "outage";
  uptime: number;
  responseTime: number;
  lastIncident: string | null;
  icon: React.ReactNode;
}

interface UptimeMetrics {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export function MonitoringUptimePage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "30d"
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: health, isLoading } = useQuery({
    queryKey: ["uptime-health"],
    queryFn: checkErrorApiHealth,
    refetchInterval: 30000,
  });

  // Mock uptime data (in real app, this would come from uptime monitoring service)
  const uptimeMetrics: UptimeMetrics = {
    daily: 99.95,
    weekly: 99.92,
    monthly: 99.89,
    yearly: 99.94,
  };

  const services: ServiceUptime[] = [
    {
      service: "Error Logging API",
      status: health?.status === "ok" ? "operational" : "degraded",
      uptime: 99.89,
      responseTime: 245,
      lastIncident: "2024-01-10T14:30:00Z",
      icon: <Server className="h-4 w-4" />,
    },
    {
      service: "Web Dashboard",
      status: "operational",
      uptime: 99.97,
      responseTime: 89,
      lastIncident: null,
      icon: <Globe className="h-4 w-4" />,
    },
    {
      service: "Database",
      status: "operational",
      uptime: 99.94,
      responseTime: 12,
      lastIncident: "2024-01-08T09:15:00Z",
      icon: <Server className="h-4 w-4" />,
    },
    {
      service: "CDN",
      status: "operational",
      uptime: 99.99,
      responseTime: 45,
      lastIncident: null,
      icon: <Wifi className="h-4 w-4" />,
    },
  ];

  // Generate mock uptime history for the last 90 days
  const generateUptimeHistory = (): UptimeRecord[] => {
    const records: UptimeRecord[] = [];
    const now = new Date();
    const days =
      timeRange === "24h"
        ? 1
        : timeRange === "7d"
        ? 7
        : timeRange === "30d"
        ? 30
        : 90;

    for (let i = days * 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const isDown = Math.random() < 0.001; // 0.1% downtime
      const isDegraded = Math.random() < 0.01; // 1% degraded performance

      records.push({
        timestamp: timestamp.toISOString(),
        status: isDown ? "down" : isDegraded ? "degraded" : "up",
        responseTime: Math.floor(Math.random() * 200) + 50,
        location: "us-east-1",
      });
    }

    return records;
  };

  const uptimeHistory = generateUptimeHistory();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "up":
        return "text-green-600 bg-green-100";
      case "degraded":
        return "text-yellow-600 bg-yellow-100";
      case "outage":
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "up":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "outage":
      case "down":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const calculateAvailability = (records: UptimeRecord[]) => {
    const totalRecords = records.length;
    const upRecords = records.filter((r) => r.status === "up").length;
    return totalRecords > 0 ? (upRecords / totalRecords) * 100 : 0;
  };

  const currentAvailability = calculateAvailability(uptimeHistory);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-semibold">Uptime Monitoring</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
          <Activity className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-semibold">Uptime Monitoring</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {currentTime.toLocaleTimeString()}
          </div>
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "24h" | "7d" | "30d" | "90d")
            }
            className="px-3 py-2 border rounded-md"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="text-lg font-semibold">
                  All Systems Operational
                </span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {currentAvailability.toFixed(2)}% uptime
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {uptimeMetrics.monthly.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {timeRange} availability
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uptime Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Daily
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {uptimeMetrics.daily}%
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              +0.05% vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              Weekly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {uptimeMetrics.weekly}%
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingDown className="h-3 w-3" />
              -0.03% vs last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              Monthly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {uptimeMetrics.monthly}%
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              +0.11% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4" />
              Yearly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {uptimeMetrics.yearly}%
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Target: 99.9%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {service.icon}
                      <span className="font-semibold">{service.service}</span>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{service.uptime}%</div>
                      <div className="text-sm text-muted-foreground">
                        uptime
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {service.responseTime}ms
                      </div>
                      <div className="text-sm text-muted-foreground">
                        response
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                </div>

                {service.lastIncident && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      Last incident:{" "}
                      {new Date(service.lastIncident).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Visual uptime indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Uptime: {service.uptime}%</span>
                    <span>Target: 99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${service.uptime}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uptime History Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Uptime History ({timeRange})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Uptime chart placeholder */}
            <div className="h-32 flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Uptime chart for {timeRange}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {uptimeHistory.length} data points,{" "}
                  {currentAvailability.toFixed(2)}% availability
                </p>
              </div>
            </div>

            {/* Status grid visualization */}
            <div>
              <div className="text-sm font-medium mb-2">
                Daily Status ({timeRange === "24h" ? "hourly" : "daily"} view)
              </div>
              <div className="grid grid-cols-30 gap-1">
                {uptimeHistory.slice(-90).map((record, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-sm ${
                      record.status === "up"
                        ? "bg-green-500"
                        : record.status === "degraded"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    title={`${new Date(record.timestamp).toLocaleString()}: ${
                      record.status
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <span>90 days ago</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
                    <span>Operational</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-sm"></div>
                    <span>Degraded</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-sm"></div>
                    <span>Outage</span>
                  </div>
                </div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Service Level Agreement (SLA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">SLA Target</div>
              <div className="text-xs text-muted-foreground mt-1">
                ~8.77 hours downtime/year
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {uptimeMetrics.monthly}%
              </div>
              <div className="text-sm text-muted-foreground">Current Month</div>
              <div className="text-xs text-green-600 mt-1">
                ✓ Above SLA target
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-muted-foreground">SLA Breaches</div>
              <div className="text-xs text-muted-foreground mt-1">
                This month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
