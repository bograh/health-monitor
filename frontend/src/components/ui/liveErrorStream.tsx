import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchErrors } from "@/utils/requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Activity,
  Pause,
  Play,
  RefreshCw,
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
      return "bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300";
    case "warning":
      return "bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300";
    case "info":
      return "bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300";
    case "debug":
      return "bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-gray-900 dark:text-gray-300";
    default:
      return "";
  }
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  return past.toLocaleTimeString();
}

interface LiveErrorStreamProps {
  maxItems?: number;
  refreshInterval?: number;
}

export function LiveErrorStream({
  maxItems = 10,
  refreshInterval = 2000,
}: LiveErrorStreamProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [errorStream, setErrorStream] = useState<BackendError[]>([]);
  const [newErrorCount, setNewErrorCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const { data: errorData, isLoading } = useQuery({
    queryKey: ["errors", "live-stream"],
    queryFn: () => fetchErrors({ limit: 20, offset: 0 }),
    refetchInterval: isPaused ? false : refreshInterval,
    refetchOnWindowFocus: false,
  });

  // Update error stream when new data arrives
  useEffect(() => {
    if (errorData?.data?.errors && !isPaused) {
      const newErrors = errorData.data.errors;

      setErrorStream((prevStream) => {
        // Find truly new errors by comparing with existing stream
        const existingIds = new Set(prevStream.map((e) => e.id));
        const freshErrors = newErrors.filter((e) => !existingIds.has(e.id));

        if (freshErrors.length > 0) {
          setNewErrorCount((prev) => prev + freshErrors.length);

          // Combine new and existing errors, limit to maxItems
          const combined = [...freshErrors, ...prevStream].slice(0, maxItems);
          return combined;
        }

        return prevStream;
      });

      setLastUpdate(new Date());
    }
  }, [errorData, isPaused, maxItems]);

  // Reset new error count when user focuses on the stream
  const handleStreamFocus = () => {
    setNewErrorCount(0);
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      setNewErrorCount(0);
    }
  };

  const handleRefresh = () => {
    setErrorStream([]);
    setNewErrorCount(0);
    setLastUpdate(new Date());
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4" />
            Live Error Stream
            {newErrorCount > 0 && !isPaused && (
              <Badge variant="destructive" className="animate-pulse">
                +{newErrorCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTogglePause}
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <Play className="h-3 w-3" />
              ) : (
                <Pause className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title="Refresh"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {isPaused
            ? "Stream paused"
            : `Last updated: ${lastUpdate.toLocaleTimeString()}`}
        </div>
      </CardHeader>
      <CardContent className="p-0" onClick={handleStreamFocus}>
        <div className="max-h-80 overflow-y-auto">
          {isLoading && errorStream.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading live errors...
            </div>
          ) : errorStream.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No recent errors - system is healthy! 🎉
            </div>
          ) : (
            <div className="space-y-1">
              {errorStream.map((error, index) => {
                const isNew = index < newErrorCount && !isPaused;
                return (
                  <div
                    key={`${error.id}-${index}`}
                    className={`p-3 border-b hover:bg-muted/50 transition-colors ${
                      isNew ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getLevelIcon(error.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getLogLevelClass(error.level)}>
                            {error.level}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {error.source}
                          </Badge>
                          {error.count > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              {error.count}x
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium line-clamp-2 mb-1">
                          {error.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(error.timestamp)}
                          </span>
                          {!error.resolved && (
                            <Badge variant="destructive" className="text-xs">
                              Open
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stream footer */}
        <div className="p-3 border-t bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {errorStream.length} of {maxItems} errors shown
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isPaused ? "bg-yellow-500" : "bg-green-500 animate-pulse"
                }`}
              />
              <span>{isPaused ? "Paused" : "Live"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
