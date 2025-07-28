export type ErrorLog = {
  id: string
  timestamp: string
  date: string
  time_since: string
  request_path: string
  level: "Error" | "Warning" | "Info"
  message: string
}
// API response types for the health monitor application
export interface LogsResponse {
  logs: ErrorLog[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

export interface MetricData {
  timestamp: string;
  value: number;
  unit: string;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  description: string;
  data: MetricData[];
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  notifications: string[];
}

export interface ApiError {
  message: string;
  code: string;
  timestamp: string;
  details?: any;
}
