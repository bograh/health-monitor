import { useQuery } from "@tanstack/react-query";
import { fetchErrorStats } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["analytics-stats"],
    queryFn: fetchErrorStats,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const resolutionRate = stats?.data?.total_errors
    ? (stats.data.resolved_errors / stats.data.total_errors) * 100
    : 0;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Data refreshed every minute
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Error Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Error Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.data?.total_errors || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total errors in system
            </p>
          </CardContent>
        </Card>

        {/* Resolution Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {resolutionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.data?.resolved_errors}/{stats?.data?.total_errors} errors
              resolved
            </p>
          </CardContent>
        </Card>

        {/* Daily Average */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Daily Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.data?.total_errors
                ? Math.round(stats.data.total_errors / 30)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Average errors per day
            </p>
          </CardContent>
        </Card>

        {/* Error Distribution */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Error Distribution Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">
                  {stats?.data?.total_errors || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Errors
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {stats?.data?.resolved_errors || 0}
                </div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {resolutionRate.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Resolution Rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">System Stability</span>
              <span className="text-sm font-medium">
                {resolutionRate > 80
                  ? "Excellent"
                  : resolutionRate > 60
                  ? "Good"
                  : "Needs Attention"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Error Volume</span>
              <span className="text-sm font-medium">
                {(stats?.data?.total_errors || 0) < 10
                  ? "Low"
                  : (stats?.data?.total_errors || 0) < 50
                  ? "Moderate"
                  : "High"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Response Time</span>
              <span className="text-sm font-medium text-green-600">
                Optimal
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
