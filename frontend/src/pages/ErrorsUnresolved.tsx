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
  Clock,
  TrendingUp,
} from "lucide-react";
import type { BackendError } from "@/types/api.types";

function getLevelIcon(level: BackendError["level"]) {
  switch (level.toLowerCase()) {
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
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

export function ErrorsUnresolvedPage() {
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
    queryKey: ["errors", "unresolved", currentPage, pageSize, sourceFilter],
    queryFn: () =>
      fetchErrors({
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        resolved: false, // Only unresolved errors
        source: sourceFilter || undefined,
      }),
    refetchInterval: 10000, // Refresh every 10 seconds for unresolved errors
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
        <h1 className="text-2xl font-semibold">Unresolved Errors</h1>
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Unresolved Errors</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {totalErrors} unresolved errors
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Auto-refresh: 10s</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Unresolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Critical Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {errors.filter((e) => e.level === "error").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {errors.filter((e) => e.level === "warning").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Most Recent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {errors.length > 0 ? getTimeAgo(errors[0].timestamp) : "None"}
            </div>
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
                <TableHead className="min-w-[80px]">Level</TableHead>
                <TableHead className="min-w-[200px] max-w-[400px]">
                  Message
                </TableHead>
                <TableHead className="min-w-[100px]">Source</TableHead>
                <TableHead className="min-w-[80px]">Count</TableHead>
                <TableHead className="min-w-[100px]">Age</TableHead>
                <TableHead className="min-w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading ? (
                errors.map((error) => (
                  <TableRow
                    key={error.id}
                    className="hover:bg-muted/50 cursor-pointer"
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
                        <Badge variant="destructive">{error.count}x</Badge>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-red-500" />
                        <span className="text-sm font-medium">
                          {getTimeAgo(error.first_seen)}
                        </span>
                      </div>
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
                ))
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
            unresolved errors
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
      <TableCell className="min-w-[100px]">
        <Skeleton className="h-[20px] w-[60px] rounded-full" />
      </TableCell>
      <TableCell className="min-w-[140px]">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </TableCell>
    </TableRow>
  ));
}
