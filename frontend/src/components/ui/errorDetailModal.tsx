import { useQuery } from "@tanstack/react-query";
import { fetchErrorById } from "@/utils/requests";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Calendar,
  User,
  Globe,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import type { BackendError } from "@/types/api.types";

interface ErrorDetailModalProps {
  errorId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

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
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "info":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "debug":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export function ErrorDetailModal({
  errorId,
  isOpen,
  onClose,
}: ErrorDetailModalProps) {
  const [showStackTrace, setShowStackTrace] = useState(false);
  const [showContext, setShowContext] = useState(false);

  const {
    data: error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["error-detail", errorId],
    queryFn: () => fetchErrorById(errorId!),
    enabled: !!errorId && isOpen,
  });

  if (!isOpen || !errorId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {error && getLevelIcon(error.level)}
              Error Details
              {error && (
                <Badge className={`${getLogLevelClass(error.level)} ml-2`}>
                  {error.level.toUpperCase()}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 pb-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          )}

          {isError && (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load error details</p>
            </div>
          )}

          {error && (
            <div className="space-y-6">
              {/* Main Error Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Error Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium text-red-700 dark:text-red-300">
                    {error.message}
                  </p>
                </CardContent>
              </Card>

              {/* Error Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Error ID</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {error.id}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(error.id)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      Timestamp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {formatTimestamp(error.timestamp)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{error.source}</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Environment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">
                      {error.environment || "Unknown"}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Occurrences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{error.count}x</Badge>
                      <span className="text-xs text-gray-500">
                        First: {formatTimestamp(error.first_seen)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Last: {formatTimestamp(error.last_seen)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {error.resolved ? (
                      <Badge className="bg-green-100 text-green-800">
                        Resolved
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Open</Badge>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* URL Information */}
              {error.url && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4" />
                      URL
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                        {error.url}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(error.url!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(error.url, "_blank")}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Agent */}
              {error.user_agent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      User Agent
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                        {error.user_agent}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(error.user_agent!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* IP Address */}
              {error.ip_address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">IP Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {error.ip_address}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(error.ip_address!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stack Trace */}
              {error.stack_trace && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-sm">Stack Trace</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowStackTrace(!showStackTrace)}
                      >
                        {showStackTrace ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        {showStackTrace ? "Hide" : "Show"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showStackTrace && (
                    <CardContent>
                      <div className="relative">
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                          {error.stack_trace}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(error.stack_trace!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Context */}
              {error.context && Object.keys(error.context).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-sm">Context Data</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowContext(!showContext)}
                      >
                        {showContext ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        {showContext ? "Hide" : "Show"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showContext && (
                    <CardContent>
                      <div className="relative">
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
                          {JSON.stringify(error.context, null, 2)}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(error.context, null, 2)
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}

              <Separator />

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <strong>Created:</strong> {formatTimestamp(error.created_at)}
                </div>
                <div>
                  <strong>Updated:</strong> {formatTimestamp(error.updated_at)}
                </div>
                {error.fingerprint && (
                  <div className="md:col-span-2">
                    <strong>Fingerprint:</strong>
                    <code className="ml-1 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      {error.fingerprint}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
