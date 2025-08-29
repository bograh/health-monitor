import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchErrors, resolveError, deleteError } from "@/utils/requests";
import { ErrorDetailModal } from "@/components/ui/errorDetailModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Eye,
  Clock,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import type { BackendError } from "@/types/api.types";

function getLevelIcon(level: BackendError["level"]) {
  switch (level.toLowerCase()) {
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-600" />;
    case "debug":
      return <Bug className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
}

function getLogLevelClass(level: BackendError["level"]): string {
  switch (level.toLowerCase()) {
    case "error":
      return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300";
    case "warning":
      return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300";
    case "info":
      return "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300";
    case "debug":
      return "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300";
    default:
      return "";
  }
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getRecencyIndicator(timestamp: string): {
  color: string;
  intensity: string;
} {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = diffMs / (1000 * 60);

  if (diffMins < 5) {
    return { color: "bg-red-500", intensity: "animate-pulse" };
  } else if (diffMins < 30) {
    return { color: "bg-orange-500", intensity: "animate-pulse" };
  } else if (diffMins < 60) {
    return { color: "bg-yellow-500", intensity: "" };
  } else {
    return { color: "bg-gray-400", intensity: "" };
  }
}

export function ErrorsRecentPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [levelFilter, setLevelFilter] = useState<string>("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const queryClient = useQueryClient();

  // Update timestamp every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const {
    data: errorData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "errors",
      "recent",
      currentPage,
      pageSize,
      levelFilter,
      sourceFilter,
    ],
    queryFn: () => {
      // Get errors from the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return fetchErrors({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        level: levelFilter || undefined,
        source: sourceFilter || undefined,
        // Note: In a real API, you'd pass timestamp filters
        // since: twentyFourHoursAgo.toISOString(),
      });
    },
    refetchInterval: 3000, // Refresh every 3 seconds for recent errors
  });

  // Mutations for error actions
  const resolveErrorMutation = useMutation({
    mutationFn: resolveError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["errors"] });
    },
  });

  const deleteErrorMutation = useMutation({
    mutationFn: deleteError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["errors"] });
    },
  });

  const handleResolveError = (id: string) => {
    resolveErrorMutation.mutate(id);
  };

  const handleDeleteError = (id: string) => {
    if (window.confirm("Are you sure you want to delete this error?")) {
      deleteErrorMutation.mutate(id);
    }
  };

  const handleViewError = (id: string) => {
    setSelectedErrorId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedErrorId(null);
  };

  if (isError) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="text-2xl font-semibold">Recent Errors</h1>
        <div className="rounded-md border p-4 text-center">
          <p className="text-red-600">
            Failed to load errors: {(error as Error)?.message}
          </p>
        </div>
      </div>
    );
  }

  const errors = errorData?.data?.errors || [];
  const totalErrors = errorData?.data?.total || 0;

  // Filter for recent errors (last 24 hours) and sort by recency
  const recentErrors = errors
    .filter((e) => {
      const hoursAgo =
        (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60);
      return hoursAgo <= 24;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  // Calculate stats
  const last5Minutes = recentErrors.filter((e) => {
    const minsAgo =
      (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60);
    return minsAgo <= 5;
  });

  const lastHour = recentErrors.filter((e) => {
    const hoursAgo =
      (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60);
    return hoursAgo <= 1;
  });

  const criticalRecent = recentErrors.filter((e) => e.level === "error");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold">Recent Errors</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {recentErrors.length} errors in last 24h
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live: 3s refresh</span>
          </div>
        </div>
      </div>

      {/* Live Activity Indicator */}
      {last5Minutes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-800">
              Live Activity: {last5Minutes.length} errors in the last 5 minutes
            </span>
          </div>
        </div>
      )}

      {/* Recent Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Last 5 Minutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {last5Minutes.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {last5Minutes.filter((e) => !e.resolved).length} unresolved
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Last Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lastHour.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastHour.filter((e) => !e.resolved).length} unresolved
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Critical Recent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalRecent.length}
            </div>
            <p className="text-xs text-muted-foreground">Error level</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-600" />
              Total (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {recentErrors.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter controls */}
      <div className="flex gap-4">
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Levels</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>

        <input
          type="text"
          placeholder="Filter by source..."
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[60px]">Live</TableHead>
                <TableHead className="min-w-[140px]">Timestamp</TableHead>
                <TableHead className="min-w-[80px]">Level</TableHead>
                <TableHead className="min-w-[200px] max-w-[400px]">
                  Message
                </TableHead>
                <TableHead className="min-w-[100px]">Source</TableHead>
                <TableHead className="min-w-[80px]">Count</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="min-w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading ? (
                recentErrors.map((error, index) => {
                  const recency = getRecencyIndicator(error.timestamp);
                  const isNew = index < 5; // Highlight first 5 as new
                  return (
                    <TableRow
                      key={error.id}
                      className={`hover:bg-muted/50 cursor-pointer ${
                        isNew ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <TableCell className="min-w-[60px]">
                        <div
                          className={`w-3 h-3 rounded-full ${recency.color} ${recency.intensity}`}
                          title={`Error from ${getTimeAgo(error.timestamp)}`}
                        />
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        <div>
                          <div className="font-medium">
                            {formatTimestamp(error.timestamp)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getTimeAgo(error.timestamp)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        <div className="flex items-center gap-2">
                          {getLevelIcon(error.level)}
                          <Badge
                            className={`rounded-full ${getLogLevelClass(
                              error.level
                            )}`}
                          >
                            {error.level}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[200px] max-w-[400px]">
                        <div className="truncate" title={error.message}>
                          {error.message}
                        </div>
                        {error.url && (
                          <div
                            className="text-xs text-muted-foreground truncate"
                            title={error.url}
                          >
                            {error.url}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        <Badge variant="outline">{error.source}</Badge>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        {error.count > 1 && (
                          <Badge variant="secondary">{error.count}x</Badge>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        {error.resolved ? (
                          <Badge className="bg-green-100 text-green-800">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Open</Badge>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[140px]">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewError(error.id)}
                            title="View Details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {!error.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveError(error.id)}
                              disabled={resolveErrorMutation.isPending}
                              title="Mark as Resolved"
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteError(error.id)}
                            disabled={deleteErrorMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Error"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRowSkeleton />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalErrors > pageSize && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalErrors)} of {totalErrors}{" "}
            recent errors
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * pageSize >= totalErrors}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Error Detail Modal */}
      <ErrorDetailModal
        errorId={selectedErrorId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={"skeleton-row-" + index}>
      <TableCell className="min-w-[60px]">
        <Skeleton className="h-[12px] w-[12px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[140px]">
        <Skeleton className="h-[20px] w-[120px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Skeleton className="h-[20px] w-[60px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[200px] max-w-[400px]">
        <Skeleton className="h-[20px] w-[250px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[100px]">
        <Skeleton className="h-[20px] w-[80px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Skeleton className="h-[20px] w-[40px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[80px]">
        <Skeleton className="h-[20px] w-[60px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[140px]">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </TableCell>
    </TableRow>
  ));
}
