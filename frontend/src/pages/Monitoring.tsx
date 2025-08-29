import { useQuery } from "@tanstack/react-query";
import { checkErrorApiHealth } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Server,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MonitoringPage() {
  const { data: apiHealth, isLoading } = useQuery({
    queryKey: ["monitoring-health"],
    queryFn: checkErrorApiHealth,
    refetchInterval: 30000,
  });

  // Mock data for additional services
  const services = [
    {
      name: "Error Logging API",
      status: apiHealth?.status === "ok" ? "healthy" : "unhealthy",
      uptime: 99.9,
      responseTime: 45,
      lastChecked: new Date().toISOString(),
    },
    {
      name: "Database",
      status: "healthy",
      uptime: 99.8,
      responseTime: 12,
      lastChecked: new Date().toISOString(),
    },
    {
      name: "Cache Service",
      status: "healthy",
      uptime: 99.95,
      responseTime: 3,
      lastChecked: new Date().toISOString(),
    },
    {
      name: "Web Server",
      status: "healthy",
      uptime: 99.7,
      responseTime: 28,
      lastChecked: new Date().toISOString(),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-semibold">System Monitoring</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const healthyServices = services.filter((s) => s.status === "healthy").length;
  const avgResponseTime =
    services.reduce((acc, s) => acc + s.responseTime, 0) / services.length;
  const avgUptime =
    services.reduce((acc, s) => acc + s.uptime, 0) / services.length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">System Monitoring</h1>
        <div className="text-sm text-muted-foreground">
          Auto-refreshed every 30 seconds
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {healthyServices}/{services.length}
            </div>
            <p className="text-xs text-muted-foreground">Services Online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgResponseTime.toFixed(0)}ms
            </div>
            <p className="text-xs text-muted-foreground">Across all services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4" />
              Average Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {avgUptime.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Last Incident
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7d</div>
            <p className="text-xs text-muted-foreground">Days ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Table */}
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
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {service.status === "healthy" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Last checked:{" "}
                      {new Date(service.lastChecked).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {service.uptime}% uptime
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {service.responseTime}ms response
                    </div>
                  </div>
                  <Badge
                    variant={
                      service.status === "healthy" ? "default" : "destructive"
                    }
                    className={
                      service.status === "healthy"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (service.responseTime / 100) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm w-12 text-right">
                      {service.responseTime}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uptime Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{service.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${service.uptime}%` }}
                      ></div>
                    </div>
                    <span className="text-sm w-12 text-right">
                      {service.uptime}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
