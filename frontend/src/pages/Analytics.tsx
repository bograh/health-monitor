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

  const errorTrend =
    stats?.errors_this_week && stats?.errors_this_month
      ? (stats.errors_this_week / (stats.errors_this_month / 4) - 1) * 100
      : 0;

  const resolutionRate = stats?.total_errors
    ? (stats.resolved_errors / stats.total_errors) * 100
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
              {errorTrend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
              Weekly Error Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {errorTrend >= 0 ? "+" : ""}
              {errorTrend.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Compared to monthly average
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
              {stats?.resolved_errors}/{stats?.total_errors} errors resolved
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
              {stats?.errors_this_month
                ? Math.round(stats.errors_this_month / 30)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Errors per day this month
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
                  {stats?.errors_today || 0}
                </div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">
                  {stats?.errors_this_week || 0}
                </div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-600">
                  {stats?.errors_this_month || 0}
                </div>
                <div className="text-sm text-muted-foreground">This Month</div>
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
                {(stats?.errors_today || 0) < 10
                  ? "Low"
                  : (stats?.errors_today || 0) < 50
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
