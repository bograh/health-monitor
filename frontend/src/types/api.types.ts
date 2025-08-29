// Backend Error Log API Types based on API_DOC.md
export interface BackendError {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info" | "debug";
  message: string;
  stack_trace?: string;
  context?: Record<string, any>;
  source: string;
  environment?: string;
  user_agent?: string;
  ip_address?: string;
  url?: string;
  fingerprint?: string;
  resolved: boolean;
  count: number;
  first_seen: string;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface ErrorsResponse {
  data: {
    errors: BackendError[];
    total: number;
  };
  status: string;
}

export interface ErrorResponse {
  data: BackendError;
  status: string;
}

export interface ErrorStatsResponse {
  data: {
    total_errors: number;
    resolved_errors: number;
  };
  status: string;
}

export interface ResolveErrorResponse {
  data: { status: string };
  status: string;
}

// Analytics Types
export interface AnalyticsTrendsResponse {
  data: {
    period: string;
    data_points: Array<{
      timestamp: string;
      error_count: number;
    }>;
  };
  status: string;
}

export interface AnalyticsPerformanceResponse {
  data: {
    avg_response_time: number;
    error_rate_percent: number;
  };
  status: string;
}

// Monitoring Types
export interface ServiceStatus {
  name: string;
  status: "healthy" | "unhealthy" | "unknown";
  uptime_percent?: number;
  response_time_ms?: number;
  last_checked?: string;
  details?: Record<string, any>;
}

export interface MonitoringServicesResponse {
  data: {
    services: ServiceStatus[];
    overall_health?: string;
  };
  status: string;
}

export interface SystemMetrics {
  cpu_usage_percent: number;
  memory_usage_percent: number;
  disk_usage_percent?: number;
  requests_per_minute?: number;
}

export interface MonitoringMetricsResponse {
  data: SystemMetrics;
  status: string;
}

export interface UptimeData {
  current_uptime_hours: number;
  uptime_percent_24h: number;
  uptime_percent_7d: number;
  uptime_percent_30d: number;
  incidents_count?: number;
  last_downtime?: string;
}

export interface MonitoringUptimeResponse {
  data: UptimeData;
  status: string;
}

// Alerts Types
export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  time_window: string;
  notifications: string[];
  enabled: boolean;
  last_triggered?: string;
}

export interface AlertRulesResponse {
  data: {
    rules: AlertRule[];
  };
  status: string;
}

export interface CreateAlertRuleRequest {
  name: string;
  condition: string;
  threshold: number;
  time_window: string;
  notifications: string[];
  enabled: boolean;
}

export interface CreateAlertRuleResponse {
  data: {
    id: string;
    name: string;
  };
  status: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  assigned_to: string;
  status: "open" | "investigating" | "resolved" | "closed";
  created_at: string;
  updated_at: string;
}

export interface IncidentsResponse {
  data: {
    incidents: Incident[];
  };
  status: string;
}

export interface CreateIncidentRequest {
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  assigned_to: string;
}

// Settings Types
export interface ApiKey {
  id: string;
  name: string;
  permissions: string[];
  expires_at?: string;
  created_at: string;
}

export interface ApiKeysResponse {
  data: {
    api_keys: ApiKey[];
  };
  status: string;
}

export interface CreateApiKeyRequest {
  name: string;
  permissions: string[];
  expires_at?: string;
}

export interface CreateApiKeyResponse {
  data: {
    id: string;
    api_key: string;
  };
  status: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

export interface TeamResponse {
  data: {
    members: TeamMember[];
  };
  status: string;
}

export interface InviteTeamMemberRequest {
  email: string;
  role: string;
}

export interface Integration {
  name: string;
  status: "connected" | "disconnected" | "error";
  config?: Record<string, any>;
}

export interface IntegrationsResponse {
  data: {
    integrations: Integration[];
  };
  status: string;
}

// Health Types
export interface HealthResponse {
  status: string;
  timestamp: string;
}

// Legacy types for backward compatibility
export type ErrorLog = {
  id: string;
  timestamp: string;
  date: string;
  time_since: string;
  request_path: string;
  level: "Error" | "Warning" | "Info";
  message: string;
};

export interface LogsResponse {
  logs: ErrorLog[];
  total?: number;
  page?: number;
  limit?: number;
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

export interface ApiError {
  message: string;
  code: string;
  timestamp: string;
  details?: any;
}
