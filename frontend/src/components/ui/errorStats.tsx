import { useQuery } from "@tanstack/react-query";
import { fetchErrorStats, checkHealth } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Server,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ErrorStats() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["error-stats"],
    queryFn: fetchErrorStats,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ["error-api-health"],
    queryFn: checkHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (statsLoading || healthLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-500">
              Failed to load error statistics
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resolvedRate =
    stats.data.total_errors > 0
      ? Math.round((stats.data.resolved_errors / stats.data.total_errors) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* API Health Status */}
      <Card className="rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Server className="h-4 w-4" />
            API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {health?.status === "ok" ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Online</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">Offline</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Errors */}
      <Card className="rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            Total Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.data.total_errors.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Resolved Errors */}
      <Card className="rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            Resolved ({resolvedRate}%)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.data.resolved_errors.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Resolution Rate */}
      <Card className="rounded-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4" />
            Resolution Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {resolvedRate}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
