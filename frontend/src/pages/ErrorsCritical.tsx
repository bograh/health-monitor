import { useState } from "react";
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
  AlertTriangle,
  Eye,
  Zap,
  Users,
  Server,
  TrendingDown,
} from "lucide-react";
import type { BackendError } from "@/types/api.types";

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

function getSeverityLevel(count: number): {
  level: string;
  color: string;
  icon: React.ReactNode;
} {
  if (count >= 100) {
    return {
      level: "Severe",
      color: "text-red-700 bg-red-100",
      icon: <Zap className="h-3 w-3" />,
    };
  } else if (count >= 50) {
    return {
      level: "High",
      color: "text-red-600 bg-red-50",
      icon: <AlertTriangle className="h-3 w-3" />,
    };
  } else if (count >= 10) {
    return {
      level: "Medium",
      color: "text-orange-600 bg-orange-50",
      icon: <TrendingDown className="h-3 w-3" />,
    };
  } else {
    return {
      level: "Low",
      color: "text-yellow-600 bg-yellow-50",
      icon: <AlertTriangle className="h-3 w-3" />,
    };
  }
}

export function ErrorsCriticalPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: errorData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["errors", "critical", currentPage, pageSize, sourceFilter],
    queryFn: () =>
      fetchErrors({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        level: "error", // Only critical/error level
        source: sourceFilter || undefined,
      }),
    refetchInterval: 5000, // Refresh every 5 seconds for critical errors
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
        <h1 className="text-2xl font-semibold">Critical Errors</h1>
        <div className="rounded-md border p-4 text-center">
          <p className="text-red-600">
            Failed to load errors: {(error as Error)?.message}
          </p>
        </div>
      </div>
    );
  }

  const errors = errorData?.errors || [];
  const totalErrors = errorData?.total || 0;

  // Calculate critical stats
  const highFrequencyErrors = errors.filter((e) => e.count >= 10);
  const unresolvedCritical = errors.filter((e) => !e.resolved);
  const recentCritical = errors.filter((e) => {
    const hoursAgo =
      (Date.now() - new Date(e.timestamp).getTime()) / (1000 * 60 * 60);
    return hoursAgo <= 1;
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <h1 className="text-2xl font-semibold text-red-700">
            Critical Errors
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {totalErrors} critical errors
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live monitoring</span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Bar */}
      {recentCritical.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-red-600" />
            <span className="font-semibold text-red-800">
              Alert: {recentCritical.length} new critical errors in the last
              hour
            </span>
          </div>
        </div>
      )}

      {/* Critical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Total Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-600" />
              High Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {highFrequencyErrors.length}
            </div>
            <p className="text-xs text-muted-foreground">10+ occurrences</p>
          </CardContent>
        </Card>

        <Card className="border-red-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-red-700" />
              Unresolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {unresolvedCritical.length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Server className="h-4 w-4 text-yellow-600" />
              Recent (1h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {recentCritical.length}
            </div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter controls */}
      <div className="flex gap-4">
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
                <TableHead className="min-w-[140px]">Timestamp</TableHead>
                <TableHead className="min-w-[100px]">Severity</TableHead>
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
                errors.map((error) => {
                  const severity = getSeverityLevel(error.count);
                  return (
                    <TableRow
                      key={error.id}
                      className={`hover:bg-muted/50 cursor-pointer ${
                        !error.resolved ? "border-l-4 border-l-red-500" : ""
                      }`}
                    >
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
                      <TableCell className="min-w-[100px]">
                        <div className="flex items-center gap-2">
                          {severity.icon}
                          <Badge className={`${severity.color} text-xs`}>
                            {severity.level}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="min-w-[200px] max-w-[400px]">
                        <div
                          className="truncate font-medium"
                          title={error.message}
                        >
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
                        <Badge
                          variant="destructive"
                          className={error.count >= 50 ? "animate-pulse" : ""}
                        >
                          {error.count}x
                        </Badge>
                      </TableCell>
                      <TableCell className="min-w-[80px]">
                        {error.resolved ? (
                          <Badge className="bg-green-100 text-green-800">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="animate-pulse"
                          >
                            CRITICAL
                          </Badge>
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
            critical errors
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
      <TableCell className="min-w-[140px]">
        <Skeleton className="h-[20px] w-[120px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[100px]">
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
