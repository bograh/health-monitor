// Backend Error Log API Types
export interface BackendError {
  id: string
  timestamp: string
  level: "error" | "warning" | "info" | "debug"
  message: string
  stack_trace?: string
  context?: Record<string, any>
  source: string
  environment?: string
  user_agent?: string
  ip_address?: string
  url?: string
  fingerprint?: string
  resolved: boolean
  count: number
  first_seen: string
  last_seen: string
  created_at: string
  updated_at: string
}

export interface ErrorsResponse {
  errors: BackendError[]
  total: number
  page: number
  limit: number
}

export interface ErrorStatsResponse {
  total_errors: number
  resolved_errors: number
  errors_today: number
  errors_this_week: number
  errors_this_month: number
}

// Legacy types for backward compatibility
export type ErrorLog = {
  id: string
  timestamp: string
  date: string
  time_since: string
  request_path: string
  level: "Error" | "Warning" | "Info"
  message: string
}

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
