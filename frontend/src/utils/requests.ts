/* eslint-disable no-useless-catch */
import axios from "axios";
import type {
  ErrorLog,
  LogsResponse,
  ServiceStatus,
  PerformanceMetric,
  AlertRule,
  BackendError,
  ErrorsResponse,
  ErrorStatsResponse,
} from "../types/api.types";

// Create an axios instance with default configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging and error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error("Response error:", error?.message || "Unknown error");

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      throw new Error(
        `HTTP error! status: ${error.response.status} - ${error.response.statusText}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error: No response received from server");
    } else {
      // Something else happened
      throw new Error(`Request error: ${error?.message || "Unknown error"}`);
    }
  }
);

export async function fetchJSONData<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<{ logs: T }>(url);
    return response.data.logs;
  } catch (error) {
    // Re-throw the error to be handled by the calling code
    throw error;
  }
}

// Alternative function for direct data fetching (without .logs wrapper)
export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// POST request helper
export async function postData<T, U>(url: string, data: U): Promise<T> {
  try {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// PUT request helper
export async function putData<T, U>(url: string, data: U): Promise<T> {
  try {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// DELETE request helper
export async function deleteData<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.delete<T>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export { apiClient };

// Specific API functions for health monitoring

// Fetch logs with proper typing
export async function fetchLogs(url: string): Promise<ErrorLog[]> {
  try {
    const response = await apiClient.get<LogsResponse>(url);
    return response.data.logs;
  } catch (error) {
    throw error;
  }
}

// Fetch service status
export async function fetchServiceStatus(
  url: string
): Promise<ServiceStatus[]> {
  try {
    const response = await apiClient.get<ServiceStatus[]>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch performance metrics
export async function fetchPerformanceMetrics(
  url: string
): Promise<PerformanceMetric[]> {
  try {
    const response = await apiClient.get<PerformanceMetric[]>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Fetch alert rules
export async function fetchAlertRules(url: string): Promise<AlertRule[]> {
  try {
    const response = await apiClient.get<AlertRule[]>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Error Logging API Configuration
const ERROR_API_BASE_URL = "http://172.31.176.1:8080";
const ERROR_API_KEY = "sk_like_BsrAYmUtVy8MUtdo9MUcr6cNU2MTjwF7";

// Create specialized axios instance for error logging API
const errorApiClient = axios.create({
  baseURL: ERROR_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": ERROR_API_KEY,
    "ngrok-skip-browser-warning": "true",
  },
});

// Add interceptors for error API client
errorApiClient.interceptors.request.use(
  (config) => {
    console.log(`Making error API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Error API request error:", error);
    return Promise.reject(error);
  }
);

errorApiClient.interceptors.response.use(
  (response) => {
    console.log(
      `Error API response from ${response.config.url}:`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      "Error API response error:",
      error?.message || "Unknown error"
    );

    if (error.response) {
      throw new Error(
        `HTTP error! status: ${error.response.status} - ${error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error("Network error: No response received from error API");
    } else {
      throw new Error(
        `Error API request error: ${error?.message || "Unknown error"}`
      );
    }
  }
);

// Error Logging API Functions

// Fetch errors with pagination and filtering
export async function fetchErrors(params?: {
  limit?: number;
  offset?: number;
  level?: string;
  source?: string;
}): Promise<ErrorsResponse> {
  try {
    const response = await errorApiClient.get<ErrorsResponse>("/api/errors", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get specific error by ID
export async function fetchErrorById(id: string): Promise<BackendError> {
  try {
    const response = await errorApiClient.get<BackendError>(
      `/api/errors/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get error statistics
export async function fetchErrorStats(): Promise<ErrorStatsResponse> {
  try {
    const response = await errorApiClient.get<ErrorStatsResponse>("/api/stats");
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Resolve an error
export async function resolveError(id: string): Promise<{ status: string }> {
  try {
    const response = await errorApiClient.put<{ status: string }>(
      `/api/errors/${id}/resolve`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete an error
export async function deleteError(id: string): Promise<void> {
  try {
    await errorApiClient.delete(`/api/errors/${id}`);
  } catch (error) {
    throw error;
  }
}

// Check API health
export async function checkErrorApiHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  try {
    const response = await errorApiClient.get<{
      status: string;
      timestamp: string;
    }>("/health");
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Dummy data for error logs (legacy)
export const data = [
  {
    id: "1",
    timestamp: "2024-06-01 10:15:23",
    level: "Error",
    path: "/database/connection",
    message: "Failed to connect to database.",
  },
  {
    id: "2",
    timestamp: "2024-06-01 10:17:45",
    level: "Warning",
    path: "/api/response",
    message: "API response time is slow.",
  },
  {
    id: "3",
    timestamp: "2024-06-01 10:20:10",
    level: "Info",
    path: "/user/login",
    message: "User admin logged in.",
  },
  {
    id: "4",
    timestamp: "2024-06-01 10:22:05",
    level: "Error",
    path: "/payment/module",
    message: "Unhandled exception in payment module.",
  },
  {
    id: "5",
    timestamp: "2024-06-01 10:25:30",
    level: "Warning",
    path: "/storage",
    message: "Disk space running low.",
  },
];
